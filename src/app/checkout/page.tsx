import type { Metadata } from "next";
import { Checkout } from "@/components/commerce/Checkout";
import { RequireAuth } from "@/components/commerce/AuthGuard";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Telogica order — secure payment by card, UPI, netbanking or cash on delivery.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  );
}
