"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cartCount } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/types";
import { emptyCart, removeItem, setItemQty } from "@/store/cartSlice";
import { useAppDispatch, useAuth, useCart } from "@/store/hooks";
import { QtyStepper } from "./AddToCart";
import { EmptyState, Loading } from "./Bits";
import { OrderSummary } from "./OrderSummary";
import { Cart, Lock, Trash, Warning } from "../Icons";

function CartRow({ line }: { line: CartLine }) {
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);

  async function change(qty: number) {
    setBusy(true);
    const result = await dispatch(setItemQty({ productId: line.product, qty }));
    setBusy(false);
    if (setItemQty.rejected.match(result)) toast.error(result.payload ?? "Could not update");
  }

  async function remove() {
    setBusy(true);
    const result = await dispatch(removeItem(line.product));
    setBusy(false);
    if (removeItem.rejected.match(result)) toast.error(result.payload ?? "Could not remove");
    else toast.success("Removed from cart");
  }

  return (
    <li
      className={`flex gap-4 border-b border-line py-6 last:border-0 ${
        line.outOfStock ? "opacity-60" : ""
      }`}
    >
      <Link
        href={`/products/${line.slug}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-base-800"
      >
        {line.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={line.image} alt={line.name} className="h-full w-full object-contain p-2" />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-fog-dim">
            No image
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/products/${line.slug}`}
              className="line-clamp-2 font-display text-sm font-semibold text-white hover:text-teal"
            >
              {line.name}
            </Link>
            <p className="mt-1 text-xs text-fog-dim">SKU {line.sku}</p>
          </div>
          <button
            onClick={remove}
            disabled={busy}
            aria-label={`Remove ${line.name} from cart`}
            className="shrink-0 rounded-lg p-2 text-fog transition hover:bg-base-800 hover:text-red-300 disabled:opacity-40"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>

        {line.outOfStock && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-300">
            <Warning className="h-3.5 w-3.5" /> Out of stock — remove to continue
          </p>
        )}
        {line.priceChangedFrom !== undefined && !line.outOfStock && (
          <p className="mt-2 text-xs text-amber-300">
            Price updated from {formatPrice(line.priceChangedFrom)}
          </p>
        )}
        {line.qtyAdjusted && !line.outOfStock && (
          <p className="mt-2 text-xs text-amber-300">
            Quantity reduced to the {line.stock} unit{line.stock === 1 ? "" : "s"} still in stock
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          {line.outOfStock ? (
            <span />
          ) : (
            <QtyStepper
              value={line.qty}
              max={Math.min(20, line.stock)}
              onChange={change}
              disabled={busy}
            />
          )}
          <div className="text-right">
            <p className="font-display text-base font-bold text-white">
              {formatPrice(line.lineTotal)}
            </p>
            {line.qty > 1 && (
              <p className="text-xs text-fog-dim">{formatPrice(line.price)} each</p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export function CartView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, totals, config, loading, hydrated } = useCart();
  const { user, status } = useAuth();

  const count = cartCount(items);
  const blocked = items.some((l) => l.outOfStock);

  // Surface anything the server pruned or clamped while the cart sat idle.
  useEffect(() => {
    const adjusted = items.filter((l) => l.qtyAdjusted && !l.outOfStock);
    if (adjusted.length) {
      toast(`Quantities adjusted to match available stock`, { icon: "⚠️" });
    }
    // Only announce once per cart load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  function toCheckout() {
    if (blocked) {
      toast.error("Remove out-of-stock items before checking out");
      return;
    }
    if (status === "ready" && !user) {
      router.push("/login?next=/checkout");
      return;
    }
    router.push("/checkout");
  }

  if (loading && !hydrated) return <Loading label="Loading your cart…" />;

  return (
    <div className="container-x py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your cart
          </h1>
          <p className="mt-2 text-sm text-fog">
            {count} item{count === 1 ? "" : "s"}
            {!user && count > 0 && (
              <span className="ml-2 text-fog-dim">· sign in at checkout to complete your order</span>
            )}
          </p>
        </div>
        {count > 0 && (
          <button
            onClick={() => void dispatch(emptyCart())}
            className="text-sm font-medium text-fog transition hover:text-red-300"
          >
            Clear cart
          </button>
        )}
      </div>

      {count === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<Cart className="h-10 w-10" />}
            title="Your cart is empty"
            intro="Browse the catalogue of fusion splicers, OTDRs, optical test sets and locators — or request a quote for defence and bespoke lines."
            action={{ label: "Browse products", href: "/products" }}
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="self-start rounded-2xl border border-line bg-base-900 px-6">
            <ul>
              {items.map((line) => (
                <CartRow key={line.product} line={line} />
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary totals={totals} config={config}>
              <button
                onClick={toCheckout}
                disabled={blocked}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal px-6 py-3.5 text-sm font-semibold text-white shadow-glow-teal transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-base-600 disabled:text-fog disabled:shadow-none"
              >
                <Lock className="h-4 w-4" />
                Proceed to checkout
              </button>
              <Link
                href="/products"
                className="mt-3 block text-center text-sm font-medium text-fog transition hover:text-white"
              >
                Continue shopping
              </Link>
            </OrderSummary>
          </div>
        </div>
      )}
    </div>
  );
}
