"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPatch, apiPost, toApiError } from "@/lib/api";
import { ORDER_STEPS } from "@/lib/commerce";
import { formatDate, formatPrice, statusLabel } from "@/lib/format";
import { site } from "@/lib/site";
import type { Order } from "@/lib/types";
import { useAuth } from "@/store/hooks";
import { ErrorNote, Loading, StatusBadge } from "./Bits";
import { Check, CreditCard, FileText, Package, Truck, Warning } from "../Icons";

const STEP_ICONS = [Check, Package, Package, Truck, Check];

function Timeline({ order }: { order: Order }) {
  if (order.status === "cancelled" || order.status === "refunded") {
    return (
      <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-red-200">
          <Warning className="h-4 w-4" />
          Order {statusLabel(order.status).toLowerCase()}
          {order.cancelledAt && ` on ${formatDate(order.cancelledAt)}`}
        </p>
        {order.cancelReason && <p className="mt-1.5 text-sm text-fog">{order.cancelReason}</p>}
      </div>
    );
  }

  const current = ORDER_STEPS.indexOf(order.status as (typeof ORDER_STEPS)[number]);

  return (
    <ol className="relative space-y-6 pl-8">
      {/* Rail */}
      <span className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-px bg-line" aria-hidden />
      <span
        className="absolute left-[15px] top-2 w-px bg-brand-gradient transition-all duration-700"
        style={{ height: `${current <= 0 ? 0 : (current / (ORDER_STEPS.length - 1)) * 100}%` }}
        aria-hidden
      />

      {ORDER_STEPS.map((step, i) => {
        const done = i <= current;
        const Icon = STEP_ICONS[i];
        const entry = [...order.statusHistory].reverse().find((h) => h.status === step);

        return (
          <li key={step} className="relative">
            <span
              className={`absolute -left-8 flex h-8 w-8 items-center justify-center rounded-full border transition ${
                done
                  ? "border-teal bg-teal text-white"
                  : "border-line bg-base-800 text-fog-dim"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <p className={`text-sm font-semibold ${done ? "text-white" : "text-fog-dim"}`}>
              {statusLabel(step)}
            </p>
            {entry ? (
              <p className="mt-0.5 text-xs text-fog">
                {formatDate(entry.at, true)}
                {entry.note && ` · ${entry.note}`}
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-fog-dim">Pending</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function OrderDetail({ orderId, confirmation = false }: { orderId: string; confirmation?: boolean }) {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { order: fetched } = await apiGet<{ order: Order }>(`/orders/${orderId}`);
      setOrder(fetched);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function payNow() {
    if (!order) return;
    setBusy(true);
    try {
      // Only the demo gateway can settle from here; Razorpay reopens at checkout.
      await apiPost("/payment/mock/pay", { orderId: order._id });
      toast.success("Payment received");
      await load();
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!order) return;
    if (!window.confirm(`Cancel order ${order.orderNumber}? Stock will be released.`)) return;
    setBusy(true);
    try {
      await apiPatch(`/orders/${order._id}/cancel`, { reason: "Cancelled by customer" });
      toast.success("Order cancelled");
      await load();
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading label="Loading order…" />;
  if (error || !order) {
    return (
      <div className="container-x py-16">
        <ErrorNote message={error ?? "Order not found"} />
        <Link href="/account/orders" className="mt-6 inline-block text-sm font-semibold text-teal">
          ← Back to my orders
        </Link>
      </div>
    );
  }

  const canCancel = ["pending", "processing"].includes(order.status);
  const canPay = !order.isPaid && order.paymentMethod === "mock" && order.status !== "cancelled";
  const discount = 0;

  return (
    <div className="container-x py-12 sm:py-16">
      {/* Letterhead — only rendered on paper. */}
      <div className="print-only mb-8 border-b border-line pb-6">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="font-display text-2xl font-bold">{site.name}</p>
            <p className="mt-1 text-xs">{site.legalNote}</p>
            <p className="mt-3 text-xs leading-relaxed">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city}
            </p>
            <p className="mt-2 text-xs">
              {site.email.sales} · {site.phones[1]}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-bold">TAX INVOICE</p>
            <p className="mt-1 text-sm">{order.orderNumber}</p>
            <p className="mt-1 text-xs">{formatDate(order.createdAt)}</p>
            <p className="mt-3 text-xs">{site.bse}</p>
            <p className="text-xs">{site.iso}</p>
          </div>
        </div>
      </div>

      {confirmation && (
        <div className="print-hide mb-10 rounded-2xl border border-grass/30 bg-grass/5 p-8 text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-black">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold text-white">
            Thank you — your order is confirmed
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-fog">
            We&rsquo;ve emailed a confirmation to{" "}
            <span className="font-medium text-white">{user?.email}</span>. Our team will begin
            preparing your instruments right away.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-white">{order.orderNumber}</h2>
            <StatusBadge status={order.status} />
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                order.isPaid
                  ? "bg-grass/10 text-grass ring-grass/25"
                  : "bg-amber-500/10 text-amber-300 ring-amber-500/25"
              }`}
            >
              {order.isPaid ? "Paid" : "Payment pending"}
            </span>
          </div>
          <p className="mt-2 text-sm text-fog">
            Placed {formatDate(order.createdAt, true)} ·{" "}
            {order.items.reduce((n, i) => n + i.qty, 0)} item
            {order.items.reduce((n, i) => n + i.qty, 0) === 1 ? "" : "s"}
          </p>
        </div>

        <div className="print-hide flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-base-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-teal/50"
          >
            <FileText className="h-4 w-4" /> Print invoice
          </button>
          {canPay && (
            <button
              onClick={payNow}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4" /> Pay now
            </button>
          )}
          {canCancel && (
            <button
              onClick={cancel}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md border border-line bg-base-800 px-4 py-2.5 text-sm font-semibold text-fog transition hover:border-red-500/40 hover:text-red-300 disabled:opacity-60"
            >
              Cancel order
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* Items */}
          <section className="rounded-2xl border border-line bg-base-900 p-6">
            <h3 className="font-display text-lg font-bold text-white">Items</h3>
            <ul className="mt-5 divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.product + item.sku} className="flex items-center gap-4 py-4">
                  <Link
                    href={`/products/${item.slug}`}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-base-800"
                  >
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-1.5"
                      />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="line-clamp-2 text-sm font-medium text-white hover:text-teal"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-fog-dim">
                      SKU {item.sku} · {formatPrice(item.price)} × {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Tracking */}
          <section className="rounded-2xl border border-line bg-base-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-white">Tracking</h3>
              {order.trackingNumber && (
                <p className="text-sm text-fog">
                  {order.courier && <span className="text-white">{order.courier}</span>}{" "}
                  <span className="font-mono text-teal">{order.trackingNumber}</span>
                </p>
              )}
            </div>
            <div className="mt-6">
              <Timeline order={order} />
            </div>
          </section>
        </div>

        {/* Aside */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-base-900 p-6">
            <h3 className="font-display text-base font-bold text-white">Payment summary</h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-fog">Subtotal</dt>
                <dd className="text-white">{formatPrice(order.itemsPrice, true)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fog">GST</dt>
                <dd className="text-white">{formatPrice(order.taxPrice, true)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-fog">Delivery</dt>
                <dd className="text-white">
                  {order.shippingPrice === 0 ? (
                    <span className="text-grass">Free</span>
                  ) : (
                    formatPrice(order.shippingPrice, true)
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3">
                <dt className="font-semibold text-white">Total</dt>
                <dd className="font-display text-lg font-bold text-white">
                  {formatPrice(order.totalPrice - discount, true)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-line pt-4 text-xs text-fog">
              {order.paymentMethod === "cod"
                ? "Cash on delivery"
                : order.paymentMethod === "razorpay"
                  ? "Card / UPI / netbanking via Razorpay"
                  : "Demo gateway"}
              {order.paidAt && ` · paid ${formatDate(order.paidAt, true)}`}
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-base-900 p-6">
            <h3 className="font-display text-base font-bold text-white">Delivery address</h3>
            <p className="mt-3 text-sm leading-relaxed text-fog">
              <span className="font-medium text-white">{order.shippingAddress.fullName}</span>
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </p>
            {order.customerNote && (
              <p className="mt-4 border-t border-line pt-4 text-sm text-fog">
                <span className="font-medium text-white">Note:</span> {order.customerNote}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-base-900 p-6 text-sm text-fog">
            <h3 className="font-display text-base font-bold text-white">Need help?</h3>
            <p className="mt-2 leading-relaxed">
              Quote {order.orderNumber} when you contact us.
            </p>
            <a
              href={`mailto:${site.email.support}`}
              className="mt-3 inline-block font-semibold text-teal hover:text-teal-400"
            >
              {site.email.support}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
