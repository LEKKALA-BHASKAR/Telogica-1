"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiGetWithMeta, toApiError } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order, PageMeta } from "@/lib/types";
import { EmptyState, ErrorNote, Loading, Pagination, StatusBadge } from "@/components/commerce/Bits";
import { ChevronRight, Package } from "@/components/Icons";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetWithMeta<{ items: Order[] }>("/orders/mine", { page, limit: 10 });
      setOrders(res.data.items);
      setMeta(res.meta ?? null);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-white">My orders</h2>
      <p className="mt-1 text-sm text-fog">
        {meta ? `${meta.total} order${meta.total === 1 ? "" : "s"}` : "Loading…"}
      </p>

      {error && (
        <div className="mt-6">
          <ErrorNote message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : orders.length ? (
        <>
          <ul className="mt-6 space-y-4">
            {orders.map((order) => (
              <li key={order._id}>
                <Link
                  href={`/account/orders/${order._id}`}
                  className="group block rounded-2xl border border-line bg-base-900 p-5 transition hover:border-teal/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="flex flex-wrap items-center gap-2.5">
                        <span className="font-display text-base font-bold text-white">
                          {order.orderNumber}
                        </span>
                        <StatusBadge status={order.status} />
                        {!order.isPaid && order.status !== "cancelled" && (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/25">
                            Payment pending
                          </span>
                        )}
                      </p>
                      <p className="mt-1.5 text-sm text-fog">
                        {formatDate(order.createdAt)} ·{" "}
                        {order.items.reduce((n, i) => n + i.qty, 0)} item
                        {order.items.reduce((n, i) => n + i.qty, 0) === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-white">
                        {formatPrice(order.totalPrice)}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-teal">
                        View details
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Item thumbnails */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {order.items.slice(0, 5).map((item) => (
                      <span
                        key={item.product + item.sku}
                        className="h-12 w-12 overflow-hidden rounded-lg border border-line bg-base-800"
                      >
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-1"
                          />
                        )}
                      </span>
                    ))}
                    {order.items.length > 5 && (
                      <span className="text-xs text-fog-dim">+{order.items.length - 5} more</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {meta && <Pagination page={meta.page} pages={meta.pages} onChange={setPage} />}
        </>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={<Package className="h-10 w-10" />}
            title="No orders yet"
            intro="When you place an order it will appear here with live delivery tracking."
            action={{ label: "Browse products", href: "/products" }}
          />
        </div>
      )}
    </div>
  );
}
