import type { Metadata } from "next";
import { RequireAuth } from "@/components/commerce/AuthGuard";
import { OrderDetail } from "@/components/commerce/OrderDetail";

export const metadata: Metadata = {
  title: "Order details",
  robots: { index: false, follow: false },
};

export default function OrderPage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth>
      <OrderDetail orderId={params.id} />
    </RequireAuth>
  );
}
