import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { CTABand } from "@/components/CTABand";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";
import { productsSeo, productsIntro, productCategories } from "@/lib/content";
import { BreadcrumbSchema, ItemListSchema } from "@/components/Seo";
import {
  Waveform, Wave, Target, Radar, Train, Factory, Check, ArrowRight,
} from "@/components/Icons";

export const metadata: Metadata = pageMetadata({
  title: productsSeo.title,
  description: productsSeo.description,
  path: "/products",
});

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Waveform, Wave, Target, Radar, Train, Factory,
};

export default function ProductsPage() {
  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
        ]}
      />
      <ItemListSchema
        name="Telogica product categories"
        items={productCategories.map((c) => ({ name: c.title, href: c.href }))}
      />

      <PageHero
        eyebrow="Product catalogue"
        title={
          <>
            Everything we sell, <span className="text-gradient">we engineer</span>
          </>
        }
        intro={productsIntro}
      />

      {/* Six categories */}
      <section className="border-b border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Browse by category"
              title="Six product families"
              intro="Precision optical and copper test instruments, RF systems and manufacturing services — designed in-house and built in Hyderabad."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {productCategories.map((c, i) => {
              const Icon = iconMap[c.icon] ?? Waveform;
              return (
                <Reveal key={c.key} delay={(i % 2) * 0.07}>
                  <div className="flex h-full flex-col rounded-2xl border border-line bg-base-800 p-7 transition-colors hover:border-teal/40">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-black">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="font-display text-lg font-bold leading-snug text-white">
                        {c.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-fog">{c.lead}</p>
                    {c.items.length > 0 && (
                      <ul className="mt-5 space-y-2.5 border-t border-line/60 pt-5">
                        {c.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-fog-bright">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href={c.href}
                      className="group mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-white hover:text-teal"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live catalogue */}
      <section className="container-x py-14 sm:py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Full catalogue"
            title="Search, filter and order"
            intro="Filter by sector, search by model, and buy online — or request a quote for defence and bespoke lines."
          />
        </Reveal>
        <div className="mt-10">
          <ProductCatalog />
        </div>
      </section>

      <CTABand
        title="Need a custom configuration or OEM build?"
        intro="We supply a far wider range than shown here. Tell us your requirement and we'll recommend the right instrument — or engineer one."
        primary={{ label: "Request a quote", href: "/contact" }}
        secondary={{ label: "Manufacturing & R&D", href: "/manufacturing" }}
      />
    </>
  );
}
