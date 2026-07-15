import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui";
import { type Category, categoryMeta, productsByCategory } from "@/lib/products";

const slugToCat: Record<string, Category> = {
  telecommunication: "Telecommunication",
  railway: "Railway",
  defence: "Defence",
};

export function generateStaticParams() {
  return Object.keys(slugToCat).map((sector) => ({ sector }));
}

export function generateMetadata({ params }: { params: { sector: string } }): Metadata {
  const cat = slugToCat[params.sector];
  if (!cat) return { title: "Solutions" };
  const meta = categoryMeta[cat];
  return { title: `${meta.label} Solutions`, description: meta.blurb };
}

export default function SectorPage({ params }: { params: { sector: string } }) {
  const cat = slugToCat[params.sector];
  if (!cat) notFound();
  const meta = categoryMeta[cat];
  const products = productsByCategory(cat);

  return (
    <>
      <PageHero
        eyebrow={`${meta.label} solutions`}
        title={<>{meta.label}</>}
        intro={meta.blurb}
      >
        <div className="mt-6">
          <Button href="/contact" variant="gradient">Request a quote</Button>
        </div>
      </PageHero>

      <section className="container-x py-14 sm:py-20">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm font-semibold text-fog">
            {products.length} instruments in {meta.label}
          </p>
          <Button href="/products" variant="ghost">All products</Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <CTABand
        title={`Need help specifying ${meta.label.toLowerCase()} equipment?`}
        intro="Our application engineers will help you match the right instrument to your network, programme or test requirement."
      />
    </>
  );
}
