/**
 * @file src/features/dashboard/components/stats-cards.tsx
 * Server Component — receives pre-fetched data, no client hooks needed.
 */

import type { DashboardStats } from "@/types/database";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
}

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

function ChangeIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        +{value}%
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
        <TrendingDown className="h-3 w-3" />
        {value}%
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-400">
      <Minus className="h-3 w-3" />
      0%
    </span>
  );
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChange,
      sub: "Last 30 days",
    },
    {
      label: "Orders",
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      sub: "Last 30 days",
    },
    {
      label: "Active Designs",
      value: stats.activeDesigns.toLocaleString(),
      change: null,
      sub: "Published products",
    },
    {
      label: "Total Views",
      value: stats.totalViews >= 1000
        ? `${(stats.totalViews / 1000).toFixed(1)}K`
        : stats.totalViews.toString(),
      change: null,
      sub: "All time",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6"
        >
          <p className="text-sm text-zinc-500">{card.label}</p>
          <div className="mt-5 flex items-end justify-between gap-2">
            <h3 className="text-4xl font-black tracking-tight text-white leading-none">
              {card.value}
            </h3>
            {card.change !== null ? (
              <ChangeIndicator value={card.change} />
            ) : (
              <span className="rounded-full bg-zinc-800/60 px-3 py-1 text-xs font-medium text-zinc-400">
                {card.sub}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-zinc-600">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}