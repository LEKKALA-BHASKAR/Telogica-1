"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { addItem } from "@/store/cartSlice";
import { toggleWishlist } from "@/store/authSlice";
import { useAppDispatch, useAuth, useCart } from "@/store/hooks";
import type { ApiProduct } from "@/lib/types";
import { Cart, Heart, Minus, Plus, Spinner } from "../Icons";

export function QtyStepper({
  value,
  min = 1,
  max = 20,
  onChange,
  disabled,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (qty: number) => void;
  disabled?: boolean;
}) {
  const step = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) onChange(next);
  };
  const btn =
    "inline-flex h-9 w-9 items-center justify-center text-fog transition hover:text-white disabled:opacity-35";

  return (
    <div className="inline-flex items-center rounded-xl border border-line bg-base-900">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={disabled || value <= min}
        className={btn}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-white" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={disabled || value >= max}
        className={btn}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * The primary buy control. Quote-only products never enter the cart — they
 * link to the RFQ form with the product pre-filled instead.
 */
export function AddToCartButton({
  product,
  qty = 1,
  className = "",
  compact = false,
}: {
  product: ApiProduct;
  qty?: number;
  className?: string;
  compact?: boolean;
}) {
  const dispatch = useAppDispatch();
  const { mutating } = useCart();
  const [busy, setBusy] = useState(false);

  if (product.requiresQuote) {
    return (
      <Link
        href={`/quote?product=${encodeURIComponent(product._id)}`}
        className={`inline-flex items-center justify-center gap-2 rounded-md bg-brand-gradient px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110 ${className}`}
      >
        Request a quote
      </Link>
    );
  }

  const soldOut = product.stock < 1;

  async function onAdd() {
    setBusy(true);
    const result = await dispatch(addItem({ product, qty }));
    setBusy(false);

    if (addItem.rejected.match(result)) {
      toast.error(result.payload ?? "Could not add that item");
      return;
    }
    toast.success(`${compact ? "Added" : `${product.name.slice(0, 32)} added`} to cart`);
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={soldOut || busy || mutating}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-teal px-5 py-3 text-sm font-semibold text-white shadow-glow-teal transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-base-600 disabled:text-fog disabled:shadow-none ${className}`}
    >
      {busy ? <Spinner className="h-4 w-4" /> : <Cart className="h-4 w-4" />}
      {soldOut ? "Out of stock" : compact ? "Add" : "Add to cart"}
    </button>
  );
}

export function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const saved = Boolean(user?.wishlist?.includes(productId));

  async function onToggle() {
    if (!user) {
      toast.error("Sign in to save items to your wishlist");
      return;
    }
    const result = await dispatch(toggleWishlist(productId));
    if (toggleWishlist.fulfilled.match(result)) {
      toast.success(result.payload.added ? "Saved to wishlist" : "Removed from wishlist");
    }
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-md border transition ${
        saved
          ? "border-teal/50 bg-teal/10 text-teal"
          : "border-line bg-base-800 text-fog hover:border-teal/40 hover:text-white"
      } ${className}`}
    >
      <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
