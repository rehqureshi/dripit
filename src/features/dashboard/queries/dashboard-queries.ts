/**
 * @file src/features/dashboard/queries/dashboard-queries.ts
 *
 * All Supabase data-fetching functions for the designer dashboard.
 *
 * Architecture decisions:
 *
 * 1. Every function is async and accepts a `designerId` — no global state,
 *    no singleton session reads. This makes functions testable and reusable
 *    across Server Components, Server Actions, and API routes.
 *
 * 2. All functions use the server Supabase client. They must only be called
 *    from Server Components or Server Actions — never imported by client
 *    components.
 *
 * 3. We use Supabase's PostgREST query builder instead of raw SQL for
 *    type safety and automatic escaping. Complex aggregates that PostgREST
 *    can't express cleanly use RPC (defined in Supabase as SQL functions).
 *
 * 4. Errors are returned as typed results, not thrown, so Server Components
 *    can decide how to handle them (show empty state vs error boundary).
 */

import { createDripitServerClient } from "@/lib/supabase/server";
import type {
  DashboardStats,
  TopDesign,
  RecentOrder,
  ProductWithDetails,
} from "@/types/database";

// ─────────────────────────────────────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches aggregated stats for the dashboard header cards.
 * Runs 3 parallel queries and merges results.
 */
export async function getDashboardStats(
  designerId: string
): Promise<DashboardStats> {
  const supabase = await createDripitServerClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const isoThirty = thirtyDaysAgo.toISOString();
  const isoSixty = sixtyDaysAgo.toISOString();

  // Run all queries in parallel — don't waterfall
  const [earningsResult, earningsPrevResult, productsResult, viewsResult] =
    await Promise.all([
      // Current 30-day earnings
      supabase
        .from("earnings")
        .select("amount")
        .eq("designer_id", designerId)
        .eq("status", "paid")
        .gte("created_at", isoThirty),

      // Previous 30-day earnings (for % change)
      supabase
        .from("earnings")
        .select("amount")
        .eq("designer_id", designerId)
        .eq("status", "paid")
        .gte("created_at", isoSixty)
        .lt("created_at", isoThirty),

      // Active (published) product count
      supabase
        .from("products")
        .select("id, views", { count: "exact" })
        .eq("designer_id", designerId)
        .eq("status", "published"),

      // Total views across all products
      supabase
        .from("products")
        .select("views")
        .eq("designer_id", designerId),
    ]);

  const currentRevenue = (earningsResult.data ?? []).reduce(
    (sum, e) => sum + (e.amount ?? 0),
    0
  );
  const prevRevenue = (earningsPrevResult.data ?? []).reduce(
    (sum, e) => sum + (e.amount ?? 0),
    0
  );
  const revenueChange =
    prevRevenue === 0
      ? 100
      : Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100);

  const activeDesigns = productsResult.count ?? 0;
  const totalViews = (viewsResult.data ?? []).reduce(
    (sum, p) => sum + (p.views ?? 0),
    0
  );

  // Orders count from earnings records (each earning = one order item sold)
  const [ordersResult, ordersPrevResult] = await Promise.all([
    supabase
      .from("earnings")
      .select("id", { count: "exact" })
      .eq("designer_id", designerId)
      .gte("created_at", isoThirty),

    supabase
      .from("earnings")
      .select("id", { count: "exact" })
      .eq("designer_id", designerId)
      .gte("created_at", isoSixty)
      .lt("created_at", isoThirty),
  ]);

  const totalOrders = ordersResult.count ?? 0;
  const prevOrders = ordersPrevResult.count ?? 0;
  const ordersChange =
    prevOrders === 0
      ? 100
      : Math.round(((totalOrders - prevOrders) / prevOrders) * 100);

  return {
    totalRevenue: currentRevenue,
    totalOrders,
    activeDesigns,
    totalViews,
    revenueChange,
    ordersChange,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent orders
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the 10 most recent orders containing the designer's products.
 *
 * Join path: earnings → orders → order_items → products → profiles (buyer)
 * We query earnings first since that's our designer-scoped anchor table.
 */
export async function getRecentOrders(
  designerId: string,
  limit = 10
): Promise<RecentOrder[]> {
  const supabase = await createDripitServerClient();

  const { data, error } = await supabase
    .from("earnings")
    .select(`
      id,
      amount,
      created_at,
      orders (
        id,
        status,
        profiles (
          full_name,
          username
        )
      ),
      products (
        title
      )
    `)
    .eq("designer_id", designerId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[Dashboard] getRecentOrders error:", error.message);
    return [];
  }

  return (data ?? []).map((row): RecentOrder => {
    const order = Array.isArray(row.orders) ? row.orders[0] : row.orders;
    const profile = order?.profiles
      ? Array.isArray(order.profiles)
        ? order.profiles[0]
        : order.profiles
      : null;
    const product = Array.isArray(row.products) ? row.products[0] : row.products;

    return {
      id: row.id,
      orderId: order?.id ?? "—",
      customerName:
        profile?.full_name ?? profile?.username ?? "Anonymous",
      productTitle: product?.title ?? "Deleted product",
      amount: row.amount,
      status: (order?.status ?? "pending") as RecentOrder["status"],
      createdAt: row.created_at,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Top designs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the designer's top 5 products by sales count,
 * with total royalties earned per product.
 */
export async function getTopDesigns(
  designerId: string,
  limit = 5
): Promise<TopDesign[]> {
  const supabase = await createDripitServerClient();

  // Fetch products with color (for mockup image) ordered by sales
  const { data: products, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      title,
      sales_count,
      product_colors (
        front_mockup_url
      )
    `)
    .eq("designer_id", designerId)
    .eq("status", "published")
    .order("sales_count", { ascending: false })
    .limit(limit);

  if (productError) {
    console.error("[Dashboard] getTopDesigns products error:", productError.message);
    return [];
  }

  if (!products?.length) return [];

  // Fetch total royalties per product in one query
  const productIds = products.map((p) => p.id);

  const { data: earnings, error: earningsError } = await supabase
    .from("earnings")
    .select("product_id, amount")
    .eq("designer_id", designerId)
    .in("product_id", productIds);

  if (earningsError) {
    console.error("[Dashboard] getTopDesigns earnings error:", earningsError.message);
  }

  // Build a royalty map: product_id → total amount
  const royaltyMap = (earnings ?? []).reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.product_id] = (acc[e.product_id] ?? 0) + e.amount;
      return acc;
    },
    {}
  );

  return products.map((p): TopDesign => {
    const colors = Array.isArray(p.product_colors)
      ? p.product_colors
      : [p.product_colors];

    return {
      id: p.id,
      title: p.title,
      sales_count: p.sales_count,
      royalty: royaltyMap[p.id] ?? 0,
      front_mockup_url: colors[0]?.front_mockup_url ?? "",
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Designer products (for designs page)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all products by the designer with full details.
 * Used on the /designs page.
 */
export async function getDesignerProducts(
  designerId: string
): Promise<ProductWithDetails[]> {
  const supabase = await createDripitServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_templates (
        name,
        category
      ),
      product_colors (
        color_name,
        color_hex,
        front_mockup_url
      ),
      product_designs (
        artwork_url
      )
    `)
    .eq("designer_id", designerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Dashboard] getDesignerProducts error:", error.message);
    return [];
  }

  return (data ?? []) as ProductWithDetails[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches the profile row for the current user.
 * Returns null if not found (triggers onboarding redirect).
 */
export async function getProfile(userId: string) {
  const supabase = await createDripitServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    // PGRST116 = row not found — not an error, just no profile yet
    if (error.code !== "PGRST116") {
      console.error("[Dashboard] getProfile error:", error.message);
    }
    return null;
  }

  return data;
}