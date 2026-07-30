"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, toApiError } from "@/lib/api";
import { formatCompactPrice, formatDate, formatPrice } from "@/lib/format";
import type { DashboardStats } from "@/lib/types";
import { ErrorNote, Loading, StatusBadge } from "@/components/commerce/Bits";
import { RevenueBars, StatTile, StatusDonut } from "@/components/commerce/Charts";
import { Warning } from "@/components/Icons";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<DashboardStats>("/admin/dashboard")
      .then(setStats)
      .catch((err) => setError(toApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Crunching the numbers…" />;
  if (error || !stats) return <ErrorNote message={error ?? "Could not load the dashboard"} />;

  return (
    <div className="space-y-8">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Paid revenue"
          value={formatCompactPrice(stats.revenue.paidTotal)}
          sub={`${stats.revenue.paidOrders} paid order${stats.revenue.paidOrders === 1 ? "" : "s"}`}
          tone="positive"
        />
        <StatTile
          label="Average order"
          value={formatCompactPrice(stats.revenue.averageOrderValue)}
          sub="Across all paid orders"
        />
        <StatTile
          label="Awaiting fulfilment"
          value={String(stats.orders.awaitingFulfilment)}
          sub={`${stats.orders.total} orders in total`}
          tone={stats.orders.awaitingFulfilment > 0 ? "warn" : "default"}
        />
        <StatTile
          label="Customers"
          value={String(stats.customers)}
          sub={`${stats.catalogue.active} active products`}
        />
      </div>

      {/* Action row */}
      {(stats.openQuotes > 0 || stats.newMessages > 0) && (
        <div className="flex flex-wrap gap-4">
          {stats.openQuotes > 0 && (
            <Link
              href="/admin/quotes"
              className="flex-1 rounded-2xl border border-teal/30 bg-teal/5 p-5 transition hover:border-teal/60"
            >
              <p className="font-display text-lg font-bold text-white">
                {stats.openQuotes} open quote request{stats.openQuotes === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-sm text-fog">Awaiting a response →</p>
            </Link>
          )}
          {stats.newMessages > 0 && (
            <Link
              href="/admin/messages"
              className="flex-1 rounded-2xl border border-cyan/30 bg-cyan/5 p-5 transition hover:border-cyan/60"
            >
              <p className="font-display text-lg font-bold text-white">
                {stats.newMessages} unread message{stats.newMessages === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-sm text-fog">From the contact form →</p>
            </Link>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-line bg-base-900 p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-white">Revenue, last 12 months</h2>
          <p className="mt-1 text-sm text-fog">Excludes cancelled orders.</p>
          <div className="mt-6">
            <RevenueBars data={stats.monthly} />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-base-900 p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-white">Orders by status</h2>
          <div className="mt-6">
            <StatusDonut byStatus={stats.orders.byStatus} />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <section className="rounded-2xl border border-line bg-base-900 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-teal hover:text-teal-400">
              View all →
            </Link>
          </div>
          {stats.recentOrders.length ? (
            <ul className="mt-5 divide-y divide-line">
              {stats.recentOrders.map((order) => (
                <li key={order._id} className="py-3">
                  <Link
                    href={`/admin/orders?q=${order.orderNumber}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium text-white">{order.orderNumber}</span>
                      <span className="block truncate text-xs text-fog-dim">
                        {typeof order.user === "object" ? order.user.name : "—"} ·{" "}
                        {formatDate(order.createdAt)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={order.status} />
                      <span className="font-semibold text-white">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-fog-dim">No orders yet</p>
          )}
        </section>

        <div className="space-y-6">
          {/* Top products */}
          <section className="rounded-2xl border border-line bg-base-900 p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-white">Best sellers</h2>
            {stats.topProducts.length ? (
              <ul className="mt-5 space-y-3">
                {stats.topProducts.map((product, i) => (
                  <li key={product._id} className="flex items-center gap-3 text-sm">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-base-700 text-xs font-bold text-fog">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-white">{product.name}</span>
                    <span className="shrink-0 text-xs text-fog">{product.qty} sold</span>
                    <span className="w-20 shrink-0 text-right font-semibold text-white">
                      {formatCompactPrice(product.revenue)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-fog-dim">No sales yet</p>
            )}
          </section>

          {/* Low stock */}
          <section className="rounded-2xl border border-line bg-base-900 p-6 shadow-card">
            <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-white">
              <Warning className="h-4 w-4 text-amber-300" />
              Low stock
            </h2>
            <p className="mt-1 text-sm text-fog">
              At or below {stats.catalogue.lowStockThreshold} units.
            </p>
            {stats.catalogue.lowStock.length ? (
              <ul className="mt-5 space-y-3">
                {stats.catalogue.lowStock.map((product) => (
                  <li key={product._id} className="flex items-center gap-3 text-sm">
                    <Link
                      href={`/admin/products?q=${encodeURIComponent(product.sku)}`}
                      className="min-w-0 flex-1 truncate text-white hover:text-teal"
                    >
                      {product.name}
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${
                        product.stock === 0
                          ? "bg-red-500/10 text-red-300 ring-red-500/25"
                          : "bg-amber-500/10 text-amber-300 ring-amber-500/25"
                      }`}
                    >
                      {product.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-fog-dim">Everything is well stocked</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
