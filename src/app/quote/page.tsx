import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteRequest } from "@/components/commerce/QuoteRequest";
import { Loading } from "@/components/commerce/Bits";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Request pricing for Telogica defence RF power amplifiers, bespoke fiber monitoring systems, optical instrumentation and volume orders.",
};

export default function QuotePage() {
  return (
    <Suspense fallback={<Loading />}>
      <QuoteRequest />
    </Suspense>
  );
}
