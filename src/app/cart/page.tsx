import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { CartView } from "@/components/commerce/CartView";

export const metadata: Metadata = privateMetadata("Your cart");

export default function CartPage() {
  return <CartView />;
}
