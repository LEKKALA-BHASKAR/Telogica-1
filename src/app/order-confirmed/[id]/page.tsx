import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { RequireAuth } from "@/components/commerce/AuthGuard";
import { OrderDetail } from "@/components/commerce/OrderDetail";

export const metadata: Metadata = privateMetadata("Order confirmed");

export default function OrderConfirmedPage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth>
      <OrderDetail orderId={params.id} confirmation />
    </RequireAuth>
  );
}
