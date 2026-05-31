/**
 * @file src/features/dashboard/components/dashboard-sidebar.tsx
 *
 * Server Component — no interactivity needed.
 * Active state is derived from the pathname passed as a prop
 * (avoids making this a client component just for usePathname).
 */

import Link from "next/link";
import { signOut } from "@/features/auth/actions/auth-actions";
import type { Profile } from "@/types/database";
import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  BarChart2,
  DollarSign,
  Users,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Designs", href: "/designs", icon: Palette },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Payouts", href: "/dashboard/payouts", icon: DollarSign },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  profile: Profile | null;
  activePath: string;
}

export function DashboardSidebar({ profile, activePath }: DashboardSidebarProps) {
  const displayName =
    profile?.full_name ?? profile?.username ?? "Designer";

  return (
    <aside className="hidden lg:flex w-72 min-h-screen border-r border-white/10 bg-zinc-950 flex-col px-6 py-8 shrink-0">
      {/* Brand + user */}
      <div>
        <Link href="/" className="text-2xl font-black tracking-[0.25em] text-white hover:opacity-70 transition-opacity">
          DRIPIT
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-xs text-zinc-500 capitalize">{profile?.role ?? "designer"}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-10 space-y-1 flex-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = activePath === href || activePath.startsWith(href + "/");
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto space-y-4">
        {/* Pro card */}
        <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-violet-300" />
            <p className="text-xs uppercase tracking-[0.25em] text-violet-300">Pro Creator</p>
          </div>
          <h3 className="text-lg font-bold text-white">Grow your brand.</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
            Unlock deeper analytics, advanced storefront customisation, and priority support.
          </p>
          <button className="mt-4 w-full rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-black hover:opacity-90 transition-opacity">
            Upgrade Plan
          </button>
        </div>

        {/* Sign out */}
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}