import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { QuoteRequest } from "@/components/commerce/QuoteRequest";
import { Loading } from "@/components/commerce/Bits";

export const metadata: Metadata = pageMetadata({
  title: "Request a Quote | Telogica Limited",
  description:
    "Request pricing for Telogica RF power amplifiers, optical fibre instrumentation, cable test equipment, custom configurations and volume orders.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <Suspense fallback={<Loading />}>
      <QuoteRequest />
    </Suspense>
  );
}
