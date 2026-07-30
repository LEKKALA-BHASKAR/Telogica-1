"use client";

import Link from "next/link";
import { useState } from "react";
import { amountToFreeShipping } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import type { ApiProduct } from "@/lib/types";
import { useCart } from "@/store/hooks";
import { AddToCartButton, QtyStepper, WishlistButton } from "./AddToCart";
import { PriceTag } from "./Bits";
import { Award, Check, Lock, Shield, Truck } from "../Icons";

/** Price, stock, quantity and the primary call to action on a product page. */
export function BuyBox({ product }: { product: ApiProduct }) {
  const [qty, setQty] = useState(1);
  const { config } = useCart();

  const maxQty = Math.min(20, Math.max(1, product.stock));
  const shortfall = amountToFreeShipping(product.price, config);

  return (
    <div className="rounded-2xl border border-line bg-base-900 p-6 shadow-card">
      <PriceTag
        price={product.price}
        mrp={product.mrp}
        requiresQuote={product.requiresQuote}
        size="lg"
      />

      {!product.requiresQuote && (
        <p className="mt-1.5 text-xs text-fog-dim">
          Inclusive of applicable taxes at checkout ({Math.round(config.taxRate * 100)}% GST)
        </p>
      )}

      <div className="mt-5">
        {product.requiresQuote ? (
          <p className="flex items-start gap-2 text-sm leading-relaxed text-fog">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
            Supplied on a quotation basis. Tell us your specification and our engineers respond
            within one business day.
          </p>
        ) : product.stock > 0 ? (
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-grass">
            <Check className="h-4 w-4" />
            In stock
            {product.stock <= 5 && (
              <span className="font-normal text-amber-300">· only {product.stock} left</span>
            )}
          </p>
        ) : (
          <p className="text-sm font-semibold text-red-300">
            Out of stock — request a quote for lead time
          </p>
        )}
      </div>

      {!product.requiresQuote && product.stock > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-sm text-fog">Quantity</span>
          <QtyStepper value={qty} max={maxQty} onChange={setQty} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <AddToCartButton product={product} qty={qty} className="min-w-[180px] flex-1" />
        <WishlistButton productId={product._id} />
      </div>

      {!product.requiresQuote && (
        <Link
          href={`/quote?product=${encodeURIComponent(product._id)}`}
          className="mt-3 block text-center text-sm font-semibold text-teal hover:text-teal-400"
        >
          Need volume pricing? Request a quote →
        </Link>
      )}

      {!product.requiresQuote && shortfall > 0 && (
        <p className="mt-4 rounded-xl border border-line bg-base-800 px-4 py-3 text-xs text-fog">
          Add <span className="font-semibold text-white">{formatPrice(shortfall)}</span> more to
          qualify for free delivery.
        </p>
      )}

      <ul className="mt-6 space-y-3 border-t border-line pt-5 text-sm text-fog">
        {product.warrantyMonths ? (
          <li className="flex items-center gap-2.5">
            <Shield className="h-4 w-4 shrink-0 text-grass" />
            {product.warrantyMonths}-month manufacturer warranty
          </li>
        ) : null}
        <li className="flex items-center gap-2.5">
          <Award className="h-4 w-4 shrink-0 text-grass" />
          ISO 9001:2015 certified manufacturing
        </li>
        <li className="flex items-center gap-2.5">
          <Truck className="h-4 w-4 shrink-0 text-grass" />
          Free delivery over {formatPrice(config.freeShippingThreshold)}
        </li>
        <li className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 shrink-0 text-grass" />
          Secure checkout — cards, UPI, netbanking or cash on delivery
        </li>
      </ul>
    </div>
  );
}
