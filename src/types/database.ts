/**
 * @file src/types/database.ts
 *
 * TypeScript types derived from the Dripit Supabase schema.
 *
 * Architecture note:
 * These are plain DTOs — Data Transfer Objects that mirror database rows
 * exactly. Derived/computed types (e.g. DashboardStats) live in their
 * feature folder. Only raw table shapes belong here.
 *
 * When you run `supabase gen types typescript` these will be replaced
 * by the auto-generated Database type. Until then, these manually-typed
 * interfaces are the source of truth.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "buyer" | "designer";

export type ProductStatus = "draft" | "published" | "archived";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type EarningStatus = "pending" | "paid" | "cancelled";

// ─────────────────────────────────────────────────────────────────────────────
// Tables
// ─────────────────────────────────────────────────────────────────────────────

export interface Profile {
  id: string; // references auth.users.id
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number;
  active: boolean;
  created_at: string;
}

export interface ProductColor {
  id: string;
  template_id: string;
  color_name: string;
  color_hex: string;
  front_mockup_url: string;
  back_mockup_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  designer_id: string;
  template_id: string;
  color_id: string;
  title: string;
  description: string | null;
  price: number;
  status: ProductStatus;
  views: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductDesign {
  id: string;
  product_id: string;
  artwork_url: string;
  x_position: number;
  y_position: number;
  scale: number;
  rotation: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  subtotal: number;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  buyer_id: string;
  product_id: string;
  rating: number; // 1–5
  comment: string | null;
  created_at: string;
}

export interface Earning {
  id: string;
  designer_id: string;
  order_id: string;
  product_id: string;
  amount: number;
  status: EarningStatus;
  created_at: string;
}

export interface Cart {
  id: string;
  buyer_id: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Joined / enriched shapes used in queries
// ─────────────────────────────────────────────────────────────────────────────

/** Product with its template and color joined — used in listings */
export interface ProductWithDetails extends Product {
  product_templates: Pick<ProductTemplate, "name" | "category">;
  product_colors: Pick<ProductColor, "color_name" | "color_hex" | "front_mockup_url">;
  product_designs: Pick<ProductDesign, "artwork_url">[];
}

/** Order with buyer profile and items joined — used in order tables */
export interface OrderWithItems extends Order {
  profiles: Pick<Profile, "full_name" | "username" | "avatar_url"> | null;
  order_items: (OrderItem & {
    products: Pick<Product, "title"> | null;
  })[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard-specific derived types
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeDesigns: number;
  totalViews: number;
  /** compared to previous 30 days */
  revenueChange: number;
  ordersChange: number;
}

export interface TopDesign {
  id: string;
  title: string;
  sales_count: number;
  royalty: number;
  front_mockup_url: string;
}

export interface RecentOrder {
  id: string;
  orderId: string;
  customerName: string;
  productTitle: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}