import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { Checkout } from "@/components/commerce/Checkout";
import { RequireAuth } from "@/components/commerce/AuthGuard";

export const metadata: Metadata = privateMetadata("Checkout");

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  );
}
