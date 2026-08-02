import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CTABand } from "@/components/CTABand";
import { categoryMeta, categoryCounts, productsByCategory } from "@/lib/products";
import { industries } from "@/lib/content";
import { cleanName } from "@/lib/format";
import { Signal, Train, Shield, ArrowRight, Check } from "@/components/Icons";
import { BreadcrumbSchema } from "@/components/Seo";

export const metadata: Metadata = pageMetadata({
  title: "Industries | Telecom, Railway and Defence Solutions — Telogica",
  description:
    "Telecom, railway and defence solutions from Telogica — fibre and copper test instruments, railway OFC and signalling maintenance, and defence-grade RF power amplifiers.",
  path: "/solutions",
});

const icon = { Telecommunication: Signal, Railway: Train, Defence: Shield };

/** Product category → the industry-content key that page reads from. */
const contentKey = {
  Telecommunication: "telecommunication",
  Railway: "railway",
  Defence: "defence",
} as const;

export default function SolutionsPage() {
  const cats = Object.keys(categoryMeta) as Array<keyof typeof categoryMeta>;
  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "Home", href: "/" },
          { name: "Industries", href: "/solutions" },
        ]}
      />

      <PageHero
        eyebrow="Industries"
        title={<>Engineered for the networks the country <span className="text-gradient">runs on</span></>}
        intro="Three sectors where failure is not an option — telecommunications, railways, and defence & aerospace. Each served from the same Hyderabad design and manufacturing floor."
      />

      <section className="container-x space-y-8 py-16 sm:py-20">
        {cats.map((cat, i) => {
          const meta = categoryMeta[cat];
          const copy = industries[contentKey[cat]];
          const Icon = icon[cat];
          const sample = productsByCategory(cat).filter((p) => p.images[0]).slice(0, 4);
          return (
            <Reveal key={cat} delay={i * 0.05}>
              <div className="overflow-hidden rounded-3xl border border-line bg-base-800 shadow-card">
                <div className="grid lg:grid-cols-[1fr_1.1fr]">
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 font-display text-2xl font-bold text-white">
                      {copy.heroTitle}
                    </h2>
                    <p className="mt-3 max-w-md text-fog">{copy.heroIntro}</p>
                    <ul className="mt-6 space-y-2.5">
                      {copy.applications.slice(0, 3).map((a) => (
                        <li key={a} className="flex items-start gap-2.5 text-sm text-fog-bright">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={meta.href}
                      className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-teal"
                    >
                      {meta.label} solutions · {categoryCounts[cat]} instruments
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-base-700 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    {sample.map((p) => (
                      <Link key={p.id} href={`/products/${p.id}`} className="group flex items-center justify-center bg-base-800 p-3 transition-colors hover:bg-base-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={`${cleanName(p.name)} — ${meta.label} test equipment`} loading="lazy" decoding="async" className="h-24 w-full object-contain transition-transform group-hover:scale-105" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      <CTABand
        title="Have a requirement in telecom, railway or defence electronics?"
        intro="Talk to our engineering team about standard products, custom builds or tender support."
        primary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
