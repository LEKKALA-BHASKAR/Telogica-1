import type { Metadata } from "next";
import { CartView } from "@/components/commerce/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the instruments in your Telogica cart and proceed to secure checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartView />;
}
