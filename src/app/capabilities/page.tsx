import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Button, Divider } from "@/components/ui";
import { CTABand } from "@/components/CTABand";
import { MissionAreas, AmplifierHighlight, WhyDefense } from "@/components/DefenseSections";
import { capabilityTable } from "@/lib/defense";
import { Layers, Boxes, Check } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Telogica's defense-grade RF capabilities — RF power amplifiers 100 MHz–40 GHz and components for radar, electronic warfare, SATCOM, military communications, and missile and UAV platforms.",
};

const tiers = [
  {
    icon: Boxes,
    tag: "Tier 1",
    title: "RF Power Amplifiers",
    text: "Benchtop and module amplifiers spanning 100 MHz to 40 GHz in multiple output-power levels — the flagship of our defense RF line.",
    points: ["100 MHz – 40 GHz", "Benchtop & module", "Multiple power levels", "Wide bandwidth & linearity"],
  },
  {
    icon: Layers,
    tag: "Tier 2",
    title: "RF Components & Subsystems",
    text: "The RF building blocks that populate defense systems — selected and engineered for bandwidth, linearity and reliability in the applications we serve.",
    points: ["Components into primes' systems", "Characterized & proven", "Single accountable partner", "Lifecycle support"],
  },
];

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title={<>Defense RF systems and the <span className="text-gradient">components that power them</span></>}
        intro="Telogica supplies defense-grade RF equipment and the components inside it — across radar, electronic warfare, secure communications, and the platforms that carry them."
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/contact" variant="primary">Discuss your program</Button>
          <Button href="/products" variant="outline">View products</Button>
        </div>
      </PageHero>

      {/* Two tiers */}
      <section className="container-x py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="What we supply"
            title="Two tiers, one partner"
            intro="Programs can source the amplifier or the parts inside it from the same house — one point of accountability across the RF chain."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {tiers.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-base-800 p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                    <t.icon className="h-6 w-6" />
                  </span>
                  <span className="rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal">
                    {t.tag}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{t.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fog">{t.text}</p>
                <ul className="mt-5 grid gap-2.5 border-t border-line/60 pt-5 sm:grid-cols-2">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-fog-bright">
                      <Check className="h-4 w-4 shrink-0 text-teal" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Domains */}
      <section className="border-y border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Domains we serve"
              title={<>Thirteen applications, <span className="text-gradient">four mission areas</span></>}
              intro="Where wideband, linear, reliable RF directly drives mission outcomes."
            />
          </Reveal>
          <div className="mt-12">
            <MissionAreas />
          </div>
        </div>
      </section>

      {/* Flagship amplifier */}
      <AmplifierHighlight />

      {/* Capability snapshot table */}
      <section className="border-t border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-24">
          <Reveal>
            <SectionHeading eyebrow="Capability snapshot" title="At a glance" />
          </Reveal>
          <Reveal>
            <div className="mt-10 overflow-hidden rounded-2xl border border-line">
              {capabilityTable.map((row, i) => (
                <div
                  key={row.attribute}
                  className={`grid grid-cols-1 gap-1 px-6 py-5 sm:grid-cols-[240px_1fr] sm:gap-6 ${
                    i % 2 ? "bg-base-800/50" : "bg-base-800"
                  }`}
                >
                  <div className="text-sm font-semibold uppercase tracking-wider text-teal">{row.attribute}</div>
                  <div className="text-sm text-fog-bright">{row.detail}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why */}
      <section className="container-x py-16 sm:py-24">
        <Reveal>
          <SectionHeading eyebrow="Why Telogica" title="Measured rigor, mission fit" />
        </Reveal>
        <div className="mt-12">
          <WhyDefense />
        </div>
      </section>

      <Divider />

      <CTABand
        title="Whatever your program needs across the spectrum."
        intro="The system or the components inside it — Telogica delivers the RF behind it. Request a capabilities brief or talk to an engineer."
        primary={{ label: "Request Capabilities Brief", href: "/contact" }}
        secondary={{ label: "Talk to an Engineer", href: "/contact" }}
      />
    </>
  );
}
