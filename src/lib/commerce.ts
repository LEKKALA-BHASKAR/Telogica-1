import type { CartLine, OrderTotals, StoreConfig } from "./types";

/**
 * Mirrors server/src/utils/pricing.ts so a guest cart can show totals before
 * an account exists. The server always recomputes these before an order is
 * saved — these numbers are a preview, never the source of truth.
 */
export const DEFAULT_STORE_CONFIG: StoreConfig = {
  currency: "INR",
  taxRate: 0.18,
  freeShippingThreshold: 25000,
  shippingFlatRate: 750,
  paymentProvider: "mock",
  razorpayKeyId: "",
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function calculateTotals(
  lines: Pick<CartLine, "price" | "qty" | "outOfStock">[],
  config: StoreConfig = DEFAULT_STORE_CONFIG
): OrderTotals {
  const payable = lines.filter((l) => !l.outOfStock);
  const itemsPrice = round2(payable.reduce((sum, l) => sum + l.price * l.qty, 0));
  const taxPrice = round2(itemsPrice * config.taxRate);
  const shippingPrice =
    itemsPrice === 0 || itemsPrice >= config.freeShippingThreshold ? 0 : config.shippingFlatRate;
  return {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice: round2(itemsPrice + taxPrice + shippingPrice),
  };
}

export function cartCount(lines: Pick<CartLine, "qty">[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

/** How much more a buyer must add to reach free shipping. */
export function amountToFreeShipping(itemsPrice: number, config: StoreConfig): number {
  if (itemsPrice >= config.freeShippingThreshold) return 0;
  return round2(config.freeShippingThreshold - itemsPrice);
}

export const ORDER_STEPS = ["pending", "processing", "packed", "shipped", "delivered"] as const;

export function orderProgress(status: string): number {
  const index = ORDER_STEPS.indexOf(status as (typeof ORDER_STEPS)[number]);
  if (index === -1) return 0;
  return ((index + 1) / ORDER_STEPS.length) * 100;
}
