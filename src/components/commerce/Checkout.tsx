"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { apiPost, toApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Address, Order, PaymentMethod } from "@/lib/types";
import { saveAddress } from "@/store/authSlice";
import { cartCheckedOut } from "@/store/cartSlice";
import { useAppDispatch, useAuth, useCart } from "@/store/hooks";
import { AddressCard, AddressForm } from "./AddressForm";
import { EmptyState, ErrorNote, Loading, SubmitButton } from "./Bits";
import { OrderSummary } from "./OrderSummary";
import { Cart, Check, CreditCard, Lock, Pencil, Truck } from "../Icons";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const STEPS = ["Delivery", "Payment", "Review"] as const;
type Step = 0 | 1 | 2;

/** Loads Razorpay's checkout script on demand, once. */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Stepper({ step }: { step: Step }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                done
                  ? "bg-grass text-black"
                  : active
                    ? "bg-teal text-white shadow-glow-teal"
                    : "border border-line bg-base-800 text-fog"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={`text-sm font-semibold ${active ? "text-white" : "text-fog"} hidden sm:inline`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}

export function Checkout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, submitting } = useAuth();
  const { items, totals, config, hydrated } = useCart();

  const [step, setStep] = useState<Step>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addresses = useMemo(() => user?.addresses ?? [], [user]);
  const payable = items.filter((l) => !l.outOfStock);
  const gatewayLabel = config.paymentProvider === "razorpay" ? "razorpay" : "mock";

  // Default to the saved default address, else the first one.
  useEffect(() => {
    if (selectedId || !addresses.length) return;
    const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (preferred?._id) setSelectedId(preferred._id);
  }, [addresses, selectedId]);

  useEffect(() => {
    if (!addresses.length) setAddingAddress(true);
  }, [addresses.length]);

  const selected = addresses.find((a) => a._id === selectedId) ?? null;

  async function onSaveAddress(address: Address) {
    const result = await dispatch(saveAddress({ address }));
    if (saveAddress.fulfilled.match(result)) {
      const created = result.payload.addresses[result.payload.addresses.length - 1];
      if (created?._id) setSelectedId(created._id);
      setAddingAddress(false);
      toast.success("Address saved");
    } else {
      toast.error(result.payload ?? "Could not save that address");
    }
  }

  async function payForOrder(order: Order) {
    if (method === "cod") return true;

    if (method === "mock") {
      await apiPost("/payment/mock/pay", { orderId: order._id });
      return true;
    }

    // Razorpay: create a gateway order, open the widget, verify the signature.
    const ready = await loadRazorpayScript();
    if (!ready || !window.Razorpay) {
      throw new Error("Could not load the payment gateway. Check your connection and try again.");
    }

    const session = await apiPost<{
      razorpayOrderId: string;
      amount: number;
      currency: string;
      keyId: string;
    }>("/payment/razorpay/order", { orderId: order._id });

    return new Promise<boolean>((resolve, reject) => {
      const rzp = new window.Razorpay!({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        name: "Telogica Limited",
        description: `Order ${order.orderNumber}`,
        order_id: session.razorpayOrderId,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: "#16C0A8" },
        handler: async (response: Record<string, string>) => {
          try {
            await apiPost("/payment/razorpay/verify", {
              orderId: order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            resolve(true);
          } catch (err) {
            reject(new Error(toApiError(err).message));
          }
        },
        modal: {
          // The order already exists and is unpaid — it stays payable from the order page.
          ondismiss: () => resolve(false),
        },
      });
      rzp.open();
    });
  }

  async function placeOrder() {
    if (!selected) {
      setError("Choose a delivery address");
      setStep(0);
      return;
    }

    setPlacing(true);
    setError(null);

    try {
      const { _id, ...shippingAddress } = selected;
      void _id;

      const { order } = await apiPost<{ order: Order }>("/orders", {
        shippingAddress,
        paymentMethod: method,
        customerNote: note,
      });

      let paid = true;
      try {
        paid = await payForOrder(order);
      } catch (err) {
        // The order exists; the customer can retry payment from the order page.
        dispatch(cartCheckedOut());
        toast.error(err instanceof Error ? err.message : "Payment failed");
        router.push(`/account/orders/${order._id}`);
        return;
      }

      dispatch(cartCheckedOut());

      if (!paid) {
        toast("Payment cancelled — your order is saved and can be paid later", { icon: "ℹ️" });
        router.push(`/account/orders/${order._id}`);
        return;
      }

      toast.success(`Order ${order.orderNumber} placed`);
      router.push(`/order-confirmed/${order._id}`);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setPlacing(false);
    }
  }

  if (!hydrated) return <Loading label="Preparing checkout…" />;

  if (!payable.length) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={<Cart className="h-10 w-10" />}
          title="There's nothing to check out"
          intro="Add an instrument to your cart, then come back to complete the order."
          action={{ label: "Browse products", href: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="container-x py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Checkout
        </h1>
        <Stepper step={step} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {error && <ErrorNote message={error} />}

          {/* ── Step 1: delivery ── */}
          <section className="rounded-2xl border border-line bg-base-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2.5 font-display text-lg font-bold text-white">
                <Truck className="h-5 w-5 text-teal" /> Delivery address
              </h2>
              {step > 0 && selected && (
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-400"
                >
                  <Pencil className="h-3.5 w-3.5" /> Change
                </button>
              )}
            </div>

            {step === 0 ? (
              <div className="mt-5 space-y-4">
                {addresses.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address._id}
                        address={address}
                        selected={address._id === selectedId}
                        onSelect={() => setSelectedId(address._id ?? null)}
                      />
                    ))}
                  </div>
                )}

                {addingAddress ? (
                  <div className="rounded-2xl border border-line bg-base-800 p-5">
                    <h3 className="mb-4 font-display text-base font-semibold text-white">
                      New delivery address
                    </h3>
                    <AddressForm
                      saving={submitting}
                      submitLabel="Use this address"
                      onSubmit={onSaveAddress}
                      onCancel={addresses.length ? () => setAddingAddress(false) : undefined}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingAddress(true)}
                    className="rounded-md border border-dashed border-line px-5 py-3 text-sm font-semibold text-fog transition hover:border-teal/50 hover:text-white"
                  >
                    + Add a new address
                  </button>
                )}

                {selected && !addingAddress && (
                  <SubmitButton type="button" onClick={() => setStep(1)}>
                    Continue to payment
                  </SubmitButton>
                )}
              </div>
            ) : selected ? (
              <p className="mt-4 text-sm leading-relaxed text-fog">
                <span className="font-semibold text-white">{selected.fullName}</span> ·{" "}
                {selected.phone}
                <br />
                {selected.line1}
                {selected.line2 ? `, ${selected.line2}` : ""}, {selected.city}, {selected.state}{" "}
                {selected.postalCode}
              </p>
            ) : null}
          </section>

          {/* ── Step 2: payment ── */}
          {step >= 1 && (
            <section className="rounded-2xl border border-line bg-base-900 p-6">
              <div className="flex items-center justify-between">
                <h2 className="inline-flex items-center gap-2.5 font-display text-lg font-bold text-white">
                  <CreditCard className="h-5 w-5 text-teal" /> Payment method
                </h2>
                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-400"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Change
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="mt-5 space-y-3">
                  <PaymentOption
                    id="cod"
                    checked={method === "cod"}
                    onSelect={() => setMethod("cod")}
                    title="Cash on delivery"
                    intro="Pay the courier when the instrument arrives. Available across India."
                  />
                  <PaymentOption
                    id={gatewayLabel}
                    checked={method === gatewayLabel}
                    onSelect={() => setMethod(gatewayLabel)}
                    title={
                      config.paymentProvider === "razorpay"
                        ? "Card, UPI or netbanking"
                        : "Demo gateway (test mode)"
                    }
                    intro={
                      config.paymentProvider === "razorpay"
                        ? "Secure payment through Razorpay. Your card details never touch our servers."
                        : "Razorpay keys aren't configured, so checkout completes through a simulated gateway."
                    }
                  />

                  <div className="pt-3">
                    <label
                      htmlFor="note"
                      className="mb-1.5 block text-sm font-medium text-fog-bright"
                    >
                      Delivery note <span className="text-fog-dim">(optional)</span>
                    </label>
                    <textarea
                      id="note"
                      rows={2}
                      maxLength={1000}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Gate access, site contact, PO reference…"
                      className="w-full rounded-xl border border-line bg-base-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-fog-dim focus:border-teal focus:ring-2 focus:ring-teal/25"
                    />
                  </div>

                  <SubmitButton type="button" onClick={() => setStep(2)} className="mt-2">
                    Review order
                  </SubmitButton>
                </div>
              ) : (
                <p className="mt-4 text-sm text-fog">
                  {method === "cod"
                    ? "Cash on delivery"
                    : config.paymentProvider === "razorpay"
                      ? "Card, UPI or netbanking via Razorpay"
                      : "Demo gateway (test mode)"}
                </p>
              )}
            </section>
          )}

          {/* ── Step 3: review ── */}
          {step === 2 && (
            <section className="rounded-2xl border border-line bg-base-900 p-6">
              <h2 className="font-display text-lg font-bold text-white">Review your order</h2>
              <ul className="mt-5 divide-y divide-line">
                {payable.map((line) => (
                  <li key={line.product} className="flex items-center gap-4 py-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-base-800">
                      {line.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={line.image}
                          alt={line.name}
                          className="h-full w-full object-contain p-1.5"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-white">{line.name}</p>
                      <p className="text-xs text-fog-dim">
                        {formatPrice(line.price)} × {line.qty}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">{formatPrice(line.lineTotal)}</p>
                  </li>
                ))}
              </ul>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-gradient px-6 py-3.5 text-sm font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock className="h-4 w-4" />
                {placing
                  ? "Placing your order…"
                  : `Place order · ${formatPrice(totals.totalPrice)}`}
              </button>

              <p className="mt-3 text-center text-xs text-fog-dim">
                By placing this order you agree to our{" "}
                <Link href="/terms" className="text-fog underline hover:text-white">
                  terms of sale
                </Link>
                .
              </p>
            </section>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary totals={totals} config={config} />
        </div>
      </div>
    </div>
  );
}

function PaymentOption({
  id,
  checked,
  onSelect,
  title,
  intro,
}: {
  id: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  intro: string;
}) {
  return (
    <label
      htmlFor={`pay-${id}`}
      className={`flex cursor-pointer gap-3 rounded-2xl border p-5 transition ${
        checked ? "border-teal bg-teal/5 ring-1 ring-teal/30" : "border-line bg-base-800 hover:border-line-strong"
      }`}
    >
      <input
        id={`pay-${id}`}
        type="radio"
        name="payment"
        checked={checked}
        onChange={onSelect}
        className="mt-1 h-4 w-4 accent-teal"
      />
      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-fog">{intro}</span>
      </span>
    </label>
  );
}
