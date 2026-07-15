import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { CTABand } from "@/components/CTABand";
import { allProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Telogica's full catalogue of test & measuring equipment — fusion splicers, OTDRs, optical power meters, cable & pipe locators, RFID markers and high-resolution optical analysers.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title={<>Instruments engineered for <span className="text-gradient">precision</span></>}
        intro="Filter our full range of precision test & measurement equipment we manufacture by sector, or search by name."
      />

      <section className="container-x py-14 sm:py-16">
        <ProductCatalog products={allProducts} />
      </section>

      <CTABand
        title="Can't find what you need?"
        intro="We supply a far wider range than shown here. Tell us your test requirement and we'll recommend the right instrument."
      />
    </>
  );
}
