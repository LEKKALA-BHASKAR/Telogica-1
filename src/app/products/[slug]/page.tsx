import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { Divider } from "@/components/ui";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { CTABand } from "@/components/CTABand";
import { BuyBox } from "@/components/commerce/BuyBox";
import { ProductReviews } from "@/components/commerce/Reviews";
import { StarRating } from "@/components/commerce/Bits";
import { RecentlyViewed, TrackProductView } from "@/components/commerce/RecentlyViewed";
import { BreadcrumbSchema, ProductSchema } from "@/components/Seo";
import { getProductByKey } from "@/lib/server-api";
import { pageMetadata } from "@/lib/seo";
import { cleanName } from "@/lib/format";
import { parseDescription } from "@/lib/products";
import { ArrowRight, Check } from "@/components/Icons";

// Prices and stock change constantly, and the API may be offline at build time.
export const dynamic = "force-dynamic";

const catSlug: Record<string, string> = {
  Telecommunication: "telecommunication",
  Railway: "railway",
  Defence: "defence",
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getProductByKey(params.slug);
  if (!data) return { title: "Product", robots: { index: false, follow: true } };

  const { product } = data;
  const name = cleanName(product.name);
  return pageMetadata({
    // Category and brand in the title win the long-tail "<model> price india"
    // style queries that drive most of the catalogue's organic traffic.
    title: `${name} | ${product.category} Test Equipment — Telogica`,
    description:
      product.shortDescription ||
      `${name} from Telogica Limited — designed and manufactured in India, ISO 9001:2015 certified, with nationwide calibration and repair support.`,
    // Canonical on the slug: the catalogue also links products by legacy id,
    // and both routes resolve, so one of them has to be declared the original.
    path: `/products/${product.slug}`,
    images: product.images.filter(Boolean).slice(0, 3),
    type: "article",
    keywords: [name, product.sku, product.brand, product.category, ...(product.tags ?? [])]
      .filter((k): k is string => Boolean(k)),
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProductByKey(params.slug);
  if (!data) notFound();

  const { product, related } = data;
  const name = cleanName(product.name);
  const { lead, bullets } = parseDescription(product.description);
  const features = product.features.length ? product.features : bullets;

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema
        trail={[
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
          { name: product.category, href: `/solutions/${catSlug[product.category]}` },
          { name, href: `/products/${product.slug}` },
        ]}
      />
      <TrackProductView product={product} />

      {/* Breadcrumb */}
      <div className="border-b border-line/60 bg-base-900">
        <div className="container-x flex flex-wrap items-center gap-2 py-4 text-sm text-fog">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white">
            Products
          </Link>
          <span>/</span>
          <Link href={`/solutions/${catSlug[product.category]}`} className="hover:text-white">
            {product.category}
          </Link>
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
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/solutions/${catSlug[product.category]}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-black"
              >
                {product.category}
              </Link>
              <span className="text-xs text-fog-dim">SKU {product.sku}</span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {name}
            </h1>

            <div className="mt-3">
              <StarRating value={product.rating} count={product.numReviews} />
            </div>

            <p className="mt-4 text-base leading-relaxed text-fog">{lead}</p>

            <div className="mt-7">
              <BuyBox product={product} />
            </div>

            {features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-fog">
                  Key features
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-fog">
                  Specifications
                </h2>
                <dl className="mt-4 divide-y divide-line rounded-2xl border border-line">
                  {product.specs.map((spec) => (
                    <div key={spec.key} className="flex gap-4 px-4 py-3 text-sm">
                      <dt className="w-40 shrink-0 text-fog">{spec.key}</dt>
                      <dd className="text-white">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      <ProductReviews
        productId={product._id}
        rating={product.rating}
        numReviews={product.numReviews}
      />

      {related.length > 0 && (
        <>
          <Divider />
          <section className="container-x py-14">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold text-white">Related instruments</h2>
              <Link
                href={`/solutions/${catSlug[product.category]}`}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-teal"
              >
                View {product.category}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        </>
      )}

      <RecentlyViewed excludeSlug={product.slug} />

      <CTABand />
    </>
  );
}
