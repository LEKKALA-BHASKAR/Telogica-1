"use client";

import { amountToFreeShipping } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import type { OrderTotals, StoreConfig } from "@/lib/types";
import { Check, Truck } from "../Icons";

/** The totals block shared by the cart, checkout and order pages. */
export function OrderSummary({
  totals,
  config,
  discount,
  couponCode,
  children,
  compact = false,
}: {
  totals: OrderTotals;
  config: StoreConfig;
  discount?: number;
  couponCode?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  const shortfall = amountToFreeShipping(totals.itemsPrice, config);
  const progress = Math.min(100, (totals.itemsPrice / config.freeShippingThreshold) * 100);
  const payable = Math.max(0, totals.totalPrice - (discount ?? 0));

  return (
    <div
      className={`rounded-2xl border border-line bg-base-900 shadow-card ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <h2 className="font-display text-lg font-bold text-white">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-fog">Subtotal</dt>
          <dd className="font-medium text-white">{formatPrice(totals.itemsPrice, true)}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-fog">GST ({Math.round(config.taxRate * 100)}%)</dt>
          <dd className="font-medium text-white">{formatPrice(totals.taxPrice, true)}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-fog">Delivery</dt>
          <dd className="font-medium text-white">
            {totals.shippingPrice === 0 ? (
              <span className="text-grass">Free</span>
            ) : (
              formatPrice(totals.shippingPrice, true)
            )}
          </dd>
        </div>

        {discount ? (
          <div className="flex justify-between">
            <dt className="text-fog">
              Discount{couponCode && <span className="ml-1.5 text-xs text-teal">{couponCode}</span>}
            </dt>
            <dd className="font-medium text-grass">− {formatPrice(discount, true)}</dd>
          </div>
        ) : null}

        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <dt className="font-display text-base font-bold text-white">Total</dt>
          <dd className="font-display text-2xl font-bold text-white">{formatPrice(payable, true)}</dd>
        </div>
      </dl>

      {/* Free-delivery nudge */}
      {totals.itemsPrice > 0 && (
        <div className="mt-5 rounded-xl border border-line bg-base-800 p-4">
          {shortfall > 0 ? (
            <>
              <p className="text-xs text-fog">
                Add <span className="font-semibold text-white">{formatPrice(shortfall)}</span> more
                for free delivery
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-base-600">
                <div
                  className="h-full rounded-full bg-brand-gradient transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-grass">
              <Truck className="h-4 w-4" /> Free delivery unlocked
            </p>
          )}
        </div>
      )}

      {children}

      <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-xs text-fog">
        <li className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 shrink-0 text-grass" /> ISO 9001:2015 certified equipment
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 shrink-0 text-grass" /> Manufacturer warranty on every
          instrument
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 shrink-0 text-grass" /> Calibration certificate supplied on
          request
        </li>
      </ul>
    </div>
  );
}
