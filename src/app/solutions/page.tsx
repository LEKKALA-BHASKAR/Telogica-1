import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CTABand } from "@/components/CTABand";
import { categoryMeta, categoryCounts, productsByCategory } from "@/lib/products";
import { Signal, Train, Shield, ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Test & measurement solutions for telecommunication, railway and defence networks — OTDRs, fusion splicers, optical analysers, cable fault and route locators.",
};

const icon = { Telecommunication: Signal, Railway: Train, Defence: Shield };

export default function SolutionsPage() {
  const cats = Object.keys(categoryMeta) as Array<keyof typeof categoryMeta>;
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={<>Engineered for the networks the country <span className="text-gradient">runs on</span></>}
        intro="Three focused practices, each backed by in-house engineering and manufacturing."
      />

      <section className="container-x space-y-8 py-16 sm:py-20">
        {cats.map((cat, i) => {
          const meta = categoryMeta[cat];
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
                    <h2 className="mt-5 font-display text-2xl font-bold text-white">{meta.label}</h2>
                    <p className="mt-3 max-w-md text-fog">{meta.blurb}</p>
                    <Link href={meta.href} className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-teal">
                      Explore {categoryCounts[cat]} instruments
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-base-700 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    {sample.map((p) => (
                      <Link key={p.id} href={`/products/${p.id}`} className="group flex items-center justify-center bg-base-800 p-3 transition-colors hover:bg-base-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={p.name} loading="lazy" className="h-24 w-full object-contain transition-transform group-hover:scale-105" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      <CTABand />
    </>
  );
}
