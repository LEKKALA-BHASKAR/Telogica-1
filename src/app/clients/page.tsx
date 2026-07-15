import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CTABand } from "@/components/CTABand";
import { SectionHeading } from "@/components/ui";
import { clients } from "@/lib/products";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Telogica serves India's leading defence, space, government and telecom organisations — ISRO, HAL, BEL, DRDO, BARC, BSNL, Airtel, RailTel and more.",
};

// Group the real client roster into meaningful buckets.
const groups: { title: string; match: string[] }[] = [
  {
    title: "Defence, Space & Research",
    match: ["bhabha", "defense research", "bharat electronics", "hal", "naval", "isro", "ministry defense", "bhavini", "9achl"],
  },
  {
    title: "Government & Public Sector",
    match: ["gail", "ntpc", "railtel", "indian railway", "hcl"],
  },
  {
    title: "Telecom Carriers & OEMs",
    match: ["tata communications", "huawei", "zte", "alcatel", "ericsson", "nokia", "tata teleservices", "airtel", "bsnl", "vodafone", "tyco", "bbc"],
  },
];

function bucket(name: string) {
  const n = name.toLowerCase();
  const g = groups.find((grp) => grp.match.some((m) => n.includes(m)));
  return g?.title ?? "Telecom Carriers & OEMs";
}

export default function ClientsPage() {
  const byGroup = groups.map((g) => ({
    title: g.title,
    items: clients.filter((c) => bucket(c.name) === g.title),
  }));

  return (
    <>
      <PageHero
        eyebrow="Our clients"
        title={<>Trusted where <span className="text-gradient">reliability is non-negotiable</span></>}
        intro="From space and defence research to national carriers and railways, leading organisations rely on Telogica instrumentation."
      />

      <section className="container-x space-y-16 py-16 sm:py-20">
        {byGroup.map((g, gi) =>
          g.items.length ? (
            <div key={g.title}>
              <Reveal>
                <SectionHeading eyebrow={`${g.items.length} organisations`} title={g.title} />
              </Reveal>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {g.items.map((c, i) => (
                  <Reveal key={c.name} delay={(i % 4) * 0.05 + gi * 0.02}>
                    <div className="group flex h-28 items-center justify-center rounded-2xl border border-line bg-white/95 p-6 shadow-card transition-all hover:-translate-y-1 hover:border-teal/40 hover:shadow-glow">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.logo as string}
                        alt={c.name}
                        loading="lazy"
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null
        )}
      </section>

      <CTABand
        title="Join the organisations that trust Telogica"
        intro="Talk to us about supplying, servicing and calibrating your test & measurement fleet."
      />
    </>
  );
}
