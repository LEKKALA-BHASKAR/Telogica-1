import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Buy Telogica test & measuring equipment online — fusion splicers, OTDRs, optical power meters, cable & pipe locators, RFID markers and high-resolution optical analysers. Defence RF lines are supplied on quotation.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title={
          <>
            Instruments engineered for <span className="text-gradient">precision</span>
          </>
        }
        intro="Filter our full range of precision test & measurement equipment by sector, search by model, and buy online — or request a quote for defence and bespoke lines."
      />

      <section className="container-x py-14 sm:py-16">
        <ProductCatalog />
      </section>

      <CTABand
        title="Can't find what you need?"
        intro="We supply a far wider range than shown here. Tell us your test requirement and we'll recommend the right instrument."
      />
    </>
  );
}
