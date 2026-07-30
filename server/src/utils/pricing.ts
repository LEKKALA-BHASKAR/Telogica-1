import { env } from "../config/env";

export interface PricedLine {
  price: number;
  qty: number;
}

export interface OrderTotals {
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Single source of truth for order maths. The client renders the same numbers
 * for preview, but the server always recomputes them before an order is saved —
 * prices in a request body are never trusted.
 */
export function calculateTotals(lines: PricedLine[]): OrderTotals {
  const itemsPrice = round2(lines.reduce((sum, l) => sum + l.price * l.qty, 0));
  const taxPrice = round2(itemsPrice * env.TAX_RATE);
  const shippingPrice =
    itemsPrice === 0 || itemsPrice >= env.FREE_SHIPPING_THRESHOLD ? 0 : env.SHIPPING_FLAT_RATE;
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
  return { itemsPrice, taxPrice, shippingPrice, totalPrice };
}

export const storefrontConfig = {
  currency: env.CURRENCY,
  taxRate: env.TAX_RATE,
  freeShippingThreshold: env.FREE_SHIPPING_THRESHOLD,
  shippingFlatRate: env.SHIPPING_FLAT_RATE,
};
