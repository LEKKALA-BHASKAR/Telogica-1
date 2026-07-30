import type { Metadata } from "next";
import { RequireAuth } from "@/components/commerce/AuthGuard";
import { OrderDetail } from "@/components/commerce/OrderDetail";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth>
      <OrderDetail orderId={params.id} confirmation />
    </RequireAuth>
  );
}
