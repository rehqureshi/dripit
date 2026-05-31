/**
 * @file src/features/dashboard/components/recent-orders-table.tsx
 * Server Component — pure display.
 */

import Link from "next/link";
import type { RecentOrder, OrderStatus } from "@/types/database";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "border-yellow-500/30 text-yellow-400",
  processing: "border-blue-500/30 text-blue-400",
  shipped: "border-violet-500/30 text-violet-400",
  delivered: "border-emerald-500/30 text-emerald-400",
  cancelled: "border-red-500/30 text-red-400",
  refunded: "border-zinc-500/30 text-zinc-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-7">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Recent Activity
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">Recent Orders</h3>
        </div>
        <Link
          href="/dashboard/orders"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-zinc-500 text-sm">No orders yet.</p>
          <p className="text-zinc-600 text-xs mt-1">
            Orders will appear here once customers purchase your designs.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.2em] text-zinc-500">
                <th className="pb-4 font-medium">Order</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 text-sm text-zinc-300 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-5 font-semibold text-white font-mono text-xs">
                    #{order.orderId.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-5">{order.customerName}</td>
                  <td className="py-5 max-w-[180px] truncate">
                    {order.productTitle}
                  </td>
                  <td className="py-5 font-semibold text-white">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-5 text-zinc-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-5">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs capitalize ${
                        STATUS_STYLES[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}