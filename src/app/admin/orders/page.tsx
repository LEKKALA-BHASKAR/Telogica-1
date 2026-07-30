"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { apiGetWithMeta, apiPatch, toApiError } from "@/lib/api";
import { formatDate, formatPrice, statusLabel } from "@/lib/format";
import type { Order, OrderStatus, PageMeta } from "@/lib/types";
import {
  ErrorNote,
  Loading,
  Pagination,
  StatusBadge,
  inputClass,
} from "@/components/commerce/Bits";
import { ChevronDown, Search } from "@/components/Icons";

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

/** Which statuses the API will accept from the current one. */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["packed", "shipped", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};

function OrderRow({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [courier, setCourier] = useState(order.courier ?? "");
  const [busy, setBusy] = useState(false);

  const allowed = TRANSITIONS[order.status];
  const customer = typeof order.user === "object" ? order.user : null;

  async function save() {
    setBusy(true);
    try {
      await apiPatch(`/orders/${order._id}/status`, {
        status,
        trackingNumber: tracking || undefined,
        courier: courier || undefined,
      });
      toast.success(`Order ${order.orderNumber} → ${statusLabel(status)}`);
      onChanged();
      setOpen(false);
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  async function markPaid() {
    setBusy(true);
    try {
      await apiPatch(`/orders/${order._id}/mark-paid`, { reference: "Manual settlement" });
      toast.success("Marked as paid");
      onChanged();
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <tr className="transition hover:bg-base-800/50">
        <td className="px-5 py-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 font-medium text-white hover:text-teal"
          >
            <ChevronDown
              className={`h-4 w-4 text-fog transition-transform ${open ? "rotate-180" : ""}`}
            />
            {order.orderNumber}
          </button>
        </td>
        <td className="px-5 py-4">
          <span className="block text-white">{customer?.name ?? "—"}</span>
          <span className="block text-xs text-fog-dim">{customer?.email}</span>
        </td>
        <td className="px-5 py-4 text-fog">{formatDate(order.createdAt)}</td>
        <td className="px-5 py-4 text-right font-semibold text-white">
          {formatPrice(order.totalPrice)}
        </td>
        <td className="px-5 py-4">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
              order.isPaid
                ? "bg-grass/10 text-grass ring-grass/25"
                : "bg-amber-500/10 text-amber-300 ring-amber-500/25"
            }`}
          >
            {order.isPaid ? "Paid" : order.paymentMethod === "cod" ? "COD" : "Unpaid"}
          </span>
        </td>
        <td className="px-5 py-4">
          <StatusBadge status={order.status} />
        </td>
      </tr>

      {open && (
        <tr className="bg-base-800/30">
          <td colSpan={6} className="px-5 py-5">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-fog">Items</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {order.items.map((item) => (
                    <li key={item.product + item.sku} className="flex justify-between gap-4">
                      <span className="text-white">
                        {item.name} <span className="text-fog-dim">× {item.qty}</span>
                      </span>
                      <span className="shrink-0 text-fog">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-fog">
                  Delivery address
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-fog">
                  {order.shippingAddress.fullName} · {order.shippingAddress.phone}
                  <br />
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                {order.customerNote && (
                  <p className="mt-3 text-sm text-amber-200">Note: {order.customerNote}</p>
                )}
              </div>

              <div className="space-y-3 rounded-2xl border border-line bg-base-900 p-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-fog">
                  Update order
                </h4>

                {allowed.length ? (
                  <>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as OrderStatus)}
                      className={inputClass}
                    >
                      <option value={order.status}>
                        {statusLabel(order.status)} (current)
                      </option>
                      {allowed.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>

                    <input
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      placeholder="Courier (BlueDart…)"
                      className={inputClass}
                    />
                    <input
                      value={tracking}
                      onChange={(e) => setTracking(e.target.value)}
                      placeholder="Tracking number"
                      className={inputClass}
                    />

                    <button
                      onClick={save}
                      disabled={busy}
                      className="w-full rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-fog">
                    {statusLabel(order.status)} is a final status — no further transitions.
                  </p>
                )}

                {!order.isPaid && order.status !== "cancelled" && (
                  <button
                    onClick={markPaid}
                    disabled={busy}
                    className="w-full rounded-md border border-line bg-base-800 px-4 py-2.5 text-sm font-semibold text-fog transition hover:text-white disabled:opacity-60"
                  >
                    Mark as paid (manual)
                  </button>
                )}

                <Link
                  href={`/account/orders/${order._id}`}
                  className="block text-center text-xs font-semibold text-teal hover:text-teal-400"
                >
                  Open full order →
                </Link>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function AdminOrdersInner() {
  const params = useSearchParams();
  const [items, setItems] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [revenue, setRevenue] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [debounced, setDebounced] = useState(params.get("q") ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debounced, status]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetWithMeta<{ items: Order[]; paidRevenue: number }>(
        "/orders/admin/all",
        {
          page,
          limit: 20,
          ...(status ? { status } : {}),
          ...(debounced ? { q: debounced } : {}),
        }
      );
      setItems(res.data.items);
      setRevenue(res.data.paidRevenue);
      setMeta(res.meta ?? null);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page, status, debounced]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Orders</h2>
          <p className="mt-1 text-sm text-fog">
            {meta ? `${meta.total} order${meta.total === 1 ? "" : "s"}` : "Loading…"} ·{" "}
            <span className="text-grass">{formatPrice(revenue)} collected</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order number…"
              className="w-48 rounded-full border border-line bg-base-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-teal"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-dim" />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-full border border-line bg-base-800 px-4 py-2.5 text-sm text-white outline-none focus:border-teal"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <ErrorNote message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : items.length ? (
        <>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-base-900">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-fog">
                <tr>
                  <th className="px-5 py-4 font-semibold">Order</th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Placed</th>
                  <th className="px-5 py-4 text-right font-semibold">Total</th>
                  <th className="px-5 py-4 font-semibold">Payment</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((order) => (
                  <OrderRow key={order._id} order={order} onChanged={load} />
                ))}
              </tbody>
            </table>
          </div>
          {meta && <Pagination page={meta.page} pages={meta.pages} onChange={setPage} />}
        </>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-line py-16 text-center text-sm text-fog">
          No orders match those filters.
        </p>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminOrdersInner />
    </Suspense>
  );
}
