import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { CTABand } from "@/components/CTABand";
import { Button } from "@/components/ui";
import { type Category, categoryMeta } from "@/lib/products";
import { listProducts } from "@/lib/server-api";

// Prices and stock come from the API on every request.
export const dynamic = "force-dynamic";

const slugToCat: Record<string, Category> = {
  telecommunication: "Telecommunication",
  railway: "Railway",
  defence: "Defence",
};

export function generateMetadata({ params }: { params: { sector: string } }): Metadata {
  const cat = slugToCat[params.sector];
  if (!cat) return { title: "Solutions" };
  const meta = categoryMeta[cat];
  return { title: `${meta.label} Solutions`, description: meta.blurb };
}

export default async function SectorPage({ params }: { params: { sector: string } }) {
  const cat = slugToCat[params.sector];
  if (!cat) notFound();
  const meta = categoryMeta[cat];
  const result = await listProducts({ sector: cat, limit: 48, sort: "relevance" });
  const products = result?.items ?? [];

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
        {products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p._id} delay={(i % 4) * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-line px-6 py-16 text-center text-sm text-fog">
            The catalogue is unavailable right now.{" "}
            <a href="/contact" className="font-semibold text-teal">
              Contact our team
            </a>{" "}
            and we&rsquo;ll send the full {meta.label.toLowerCase()} range.
          </p>
        )}
      </section>

      <CTABand
        title={`Need help specifying ${meta.label.toLowerCase()} equipment?`}
        intro="Our application engineers will help you match the right instrument to your network, programme or test requirement."
      />
    </>
  );
}
