import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { CTABand } from "@/components/CTABand";
import { Button, SectionHeading, Eyebrow } from "@/components/ui";
import { type Category, categoryMeta } from "@/lib/products";
import { industries } from "@/lib/content";
import { listProducts } from "@/lib/server-api";
import { pageMetadata } from "@/lib/seo";
import { BreadcrumbSchema, ItemListSchema } from "@/components/Seo";
import { cleanName } from "@/lib/format";
import { Check, Target, Sparkle, Users } from "@/components/Icons";

// Prices and stock come from the API on every request.
export const dynamic = "force-dynamic";

type Sector = keyof typeof industries;

const slugToCat: Record<Sector, Category> = {
  telecommunication: "Telecommunication",
  railway: "Railway",
  defence: "Defence",
};

function resolve(slug: string): Sector | null {
  // hasOwnProperty, not `in` — `in` would match inherited keys like "constructor".
  return Object.prototype.hasOwnProperty.call(industries, slug) ? (slug as Sector) : null;
}

export function generateMetadata({ params }: { params: { sector: string } }): Metadata {
  const sector = resolve(params.sector);
  // An unresolved slug 404s in the page body; noindex keeps the soft-404 out
  // of the index in the window before the 404 status is seen.
  if (!sector) return { title: "Industries", robots: { index: false, follow: true } };
  const { seo } = industries[sector];
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/solutions/${sector}`,
  });
}

export default async function SectorPage({ params }: { params: { sector: string } }) {
  const sector = resolve(params.sector);
  if (!sector) notFound();

  const copy = industries[sector];
  const cat = slugToCat[sector];
  const meta = categoryMeta[cat];
  const result = await listProducts({ sector: cat, limit: 48, sort: "relevance" });
  const products = result?.items ?? [];

  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "Home", href: "/" },
          { name: "Industries", href: "/solutions" },
          { name: meta.label, href: `/solutions/${sector}` },
        ]}
      />
      {products.length > 0 && (
        <ItemListSchema
          name={`${meta.label} instruments`}
          items={products.map((p) => ({
            name: cleanName(p.name),
            href: `/products/${p.slug}`,
          }))}
        />
      )}

      <PageHero eyebrow={copy.eyebrow} title={copy.heroTitle} intro={copy.heroIntro}>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/contact" variant="gradient">Request a quote</Button>
          <Button href="/products" variant="outline">Browse products</Button>
        </div>
      </PageHero>

      {/* Challenge / answer */}
      <section className="container-x py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-base-800 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-teal/30 bg-teal/10 text-teal">
                <Target className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-white">
                {copy.challengeTitle}
              </h2>
              <p className="mt-3 leading-relaxed text-fog">{copy.challenge}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="gradient-ring flex h-full flex-col rounded-2xl bg-base-900 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                <Sparkle className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-white">
                {copy.answerTitle}
              </h2>
              <p className="mt-3 leading-relaxed text-fog">{copy.answer}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Applications + who we serve */}
      <section className="border-y border-line/60 bg-base-900">
        <div className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <SectionHeading eyebrow="Applications" title="Where our equipment works" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {copy.applications.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2.5 rounded-xl border border-line bg-base-800 px-4 py-3.5 text-sm leading-relaxed text-fog-bright"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-line bg-base-800 p-8">
              <Eyebrow>Who we serve</Eyebrow>
              <span className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                <Users className="h-5 w-5" />
              </span>
              <p className="mt-4 leading-relaxed text-fog">{copy.whoWeServe}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Catalogue */}
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
        title={copy.cta.title}
        intro={copy.cta.intro}
        primary={copy.cta.primary}
        secondary={copy.cta.secondary ?? { label: "See all industries", href: "/solutions" }}
      />
    </>
  );
}
