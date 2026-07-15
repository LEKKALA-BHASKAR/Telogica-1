import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { Button, Divider } from "@/components/ui";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { CTABand } from "@/components/CTABand";
import {
  allProducts,
  getProduct,
  relatedProducts,
  parseDescription,
  categoryMeta,
  shortDesc,
} from "@/lib/products";
import { Check, Shield, ArrowRight, Award } from "@/components/Icons";

export function generateStaticParams() {
  return allProducts.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProduct(params.id);
  if (!p) return { title: "Product" };
  return {
    title: p.name.replace(/\s+/g, " ").trim(),
    description: shortDesc(p.description, 155),
  };
}

const catSlug: Record<string, string> = {
  Telecommunication: "telecommunication",
  Railway: "railway",
  Defence: "defence",
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();

  const { lead, bullets } = parseDescription(product.description);
  const related = relatedProducts(product.id);
  const meta = categoryMeta[product.category];
  const name = product.name.replace(/\s+/g, " ").trim();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-line/60 bg-base-900">
        <div className="container-x flex flex-wrap items-center gap-2 py-4 text-sm text-fog">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white">Products</Link>
          <span>/</span>
          <Link href={`/solutions/${catSlug[product.category]}`} className="hover:text-white">{meta.label}</Link>
          <span>/</span>
          <span className="font-medium text-white">{name}</span>
        </div>
      </div>

      <section className="container-x grid gap-12 py-12 lg:grid-cols-2 lg:py-16">
        <Reveal>
          <ProductGallery images={product.images} name={name} />
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <Link
              href={`/solutions/${catSlug[product.category]}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-black"
            >
              {meta.label}
            </Link>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-fog">{lead}</p>

            {bullets.length > 0 && (
              <div className="mt-7">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-fog">Key features</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust row */}
            <div className="mt-7 flex flex-wrap gap-3">
              {product.warrantyMonths && (
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-base-800 px-3.5 py-1.5 text-sm font-medium text-white">
                  <Shield className="h-4 w-4 text-fog" /> {product.warrantyMonths}-month warranty
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-base-800 px-3.5 py-1.5 text-sm font-medium text-white">
                <Award className="h-4 w-4 text-fog" /> ISO 9001:2015
              </span>
            </div>

            {/* Quote box */}
            <div className="mt-8 rounded-2xl border border-line bg-base-900 p-6">
              <p className="font-display text-lg font-semibold text-white">Request pricing &amp; availability</p>
              <p className="mt-1.5 text-sm text-fog">
                This instrument is supplied on a quotation basis. Tell us your requirement and our team will respond within 24 hours.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href={`/contact?product=${encodeURIComponent(name)}`} variant="gradient">Request a quote</Button>
                <Button href="/products" variant="outline" icon={false}>Back to catalogue</Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {related.length > 0 && (
        <>
          <Divider />
          <section className="container-x py-14">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold text-white">Related instruments</h2>
              <Link href={`/solutions/${catSlug[product.category]}`} className="group inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-teal">
                View {meta.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      )}

      <CTABand />
    </>
  );
}
