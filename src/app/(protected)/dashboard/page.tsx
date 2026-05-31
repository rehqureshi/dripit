/**
 * @file src/app/(protected)/dashboard/page.tsx
 *
 * Designer dashboard — Server Component.
 *
 * Architecture:
 * - getCurrentUser() in (protected)/layout.tsx already guarantees auth.
 *   We read the user from the layout via the auth util, not re-fetching here.
 * - All data is fetched in parallel with Promise.all — no waterfalls.
 * - Every section is a separate Server Component for clean separation.
 * - No mock data. No static arrays. All real Supabase queries.
 */

import { headers } from "next/headers";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/features/auth/utils/session";
import {
  getDashboardStats,
  getRecentOrders,
  getTopDesigns,
  getProfile,
} from "@/features/dashboard/queries/dashboard-queries";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { StatsCards } from "@/features/dashboard/components/stats-cards";
import { RecentOrdersTable } from "@/features/dashboard/components/recent-orders-table";
import { TopDesigns } from "@/features/dashboard/components/top-designs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Dripit",
};

// Revalidate every 60s — dashboard data doesn't need to be real-time
export const revalidate = 60;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Fetch profile and all dashboard data in parallel
  const [profile, stats, recentOrders, topDesigns] = await Promise.all([
    getProfile(user.id),
    getDashboardStats(user.id),
    getRecentOrders(user.id, 8),
    getTopDesigns(user.id, 5),
  ]);

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/dashboard";

  const displayName =
    profile?.full_name ?? profile?.username ?? user.displayName ?? "Designer";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar profile={profile} activePath={pathname} />

        {/* Main */}
        <main className="flex-1 px-6 py-8 lg:px-10 min-w-0">

          {/* Topbar */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                Overview
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-tight">
                Welcome back, {displayName.split(" ")[0]}.
              </h2>
              <p className="mt-3 max-w-2xl text-zinc-400">
                {stats.totalOrders > 0
                  ? `You have ${stats.totalOrders} orders this month with ${stats.activeDesigns} active designs live in the marketplace.`
                  : "Your creator storefront is live. Start by uploading your first design."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard/analytics"
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 hover:border-white/30 hover:text-white transition-colors"
              >
                Analytics
              </Link>
              <Link
                href="/designs/create"
                className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                New Design
              </Link>
            </div>
          </div>

          {/* Hero card */}
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-600/20 via-zinc-900 to-black p-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300">
                  30-Day Performance
                </p>
                <h3 className="mt-4 text-5xl font-black leading-none tracking-tight">
                  {stats.revenueChange >= 0 ? "+" : ""}
                  {stats.revenueChange}% growth
                </h3>
                <p className="mt-5 max-w-xl leading-relaxed text-zinc-300">
                  {stats.activeDesigns > 0
                    ? `You have ${stats.activeDesigns} designs live. ${stats.totalOrders} orders processed this month.`
                    : "Publish your first design to start earning royalties on every sale."}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-2xl font-bold">
                      {stats.totalViews >= 1000
                        ? `${(stats.totalViews / 1000).toFixed(1)}K`
                        : stats.totalViews}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Store Views
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-2xl font-bold">
                      {stats.activeDesigns}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Live Designs
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero image */}
              <div className="relative h-[280px] overflow-hidden rounded-[2rem] border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&q=80"
                  alt="Dashboard banner"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Floating CTA if no designs yet */}
                {stats.activeDesigns === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Link
                      href="/designs/create"
                      className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                      Upload First Design
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="mt-10">
            <StatsCards stats={stats} />
          </div>

          {/* Orders + Top Designs */}
          <div className="mt-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <RecentOrdersTable orders={recentOrders} />
            <TopDesigns designs={topDesigns} />
          </div>

          {/* Bottom spacer */}
          <div className="h-16" />
        </main>
      </div>
    </div>
  );
}