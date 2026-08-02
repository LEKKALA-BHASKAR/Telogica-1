import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Button, SectionHeading, Eyebrow, Divider } from "@/components/ui";
import { CTABand } from "@/components/CTABand";
import { manufacturingSeo, manufacturing } from "@/lib/content";
import { site } from "@/lib/site";
import { Microscope, Factory, Boxes, Check, ShieldCheck } from "@/components/Icons";
import { BreadcrumbSchema } from "@/components/Seo";

export const metadata: Metadata = pageMetadata({
  title: manufacturingSeo.title,
  description: manufacturingSeo.description,
  path: "/manufacturing",
});

/** The lifecycle stages housed under the Hyderabad roof. */
const lifecycle = [
  "Research & development",
  "Hardware & firmware design",
  "Prototyping",
  "Production",
  "Testing",
  "Calibration",
  "Repair & field support",
];

export default function ManufacturingPage() {
  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "Home", href: "/" },
          { name: "Manufacturing & R&D", href: "/manufacturing" },
        ]}
      />

      <PageHero
        eyebrow={manufacturing.eyebrow}
        title={
          <>
            Designed and Built <span className="text-gradient">Under One Roof</span>
          </>
        }
        intro={manufacturing.heroIntro}
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/contact" variant="gradient">Enquire about EMS</Button>
          <Button href="/products" variant="outline">View products</Button>
        </div>
      </PageHero>

      {/* Lifecycle strip */}
      <section className="border-b border-line/60 bg-base-900">
        <div className="container-x py-12">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-fog">
              The complete product lifecycle, in Hyderabad
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {lifecycle.map((stage) => (
                <span
                  key={stage}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-base-800 px-3.5 py-1.5 text-sm font-medium text-white"
                >
                  <Check className="h-3.5 w-3.5 text-teal" />
                  {stage}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* R&D */}
      <section className="container-x py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <Eyebrow>Research & development</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white">
              {manufacturing.rnd.title} driven by field feedback
            </h2>
            <p className="mt-5 leading-relaxed text-fog">{manufacturing.rnd.body}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="gradient-ring relative overflow-hidden rounded-2xl bg-base-900 p-8">
              <div className="bg-grid absolute inset-0 opacity-40" />
              <div className="glow-teal absolute -right-10 -top-10 h-56 w-56 opacity-40" />
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                  <Microscope className="h-6 w-6" />
                </span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-teal">
                  Engineering disciplines
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {["RF", "Optical", "Analog", "Digital", "Embedded", "Production"].map((d) => (
                    <div
                      key={d}
                      className="rounded-lg border border-line bg-base-800 px-4 py-3 text-sm font-medium text-fog-bright"
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Production & quality */}
      <section className="border-y border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Production & quality"
              title={<>Built to <span className="text-gradient">documented acceptance criteria</span></>}
              intro="Every instrument is tested and calibrated before dispatch, on lines certified to ISO 9001:2015."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {manufacturing.production.points.map((p, i) => (
              <Reveal key={p} delay={(i % 2) * 0.06}>
                <div className="flex h-full items-start gap-3.5 rounded-2xl border border-line bg-base-800 p-6">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <p className="text-sm leading-relaxed text-fog-bright">{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EMS */}
      <section className="container-x py-16 sm:py-20">
        <Reveal>
          <div className="grid items-center gap-10 rounded-3xl border border-line bg-base-800 p-8 shadow-card sm:p-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                <Factory className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold leading-tight text-white">
                {manufacturing.ems.title}
              </h2>
            </div>
            <div>
              <p className="leading-relaxed text-fog">{manufacturing.ems.body}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button href={manufacturing.ems.cta.href} variant="primary">
                  {manufacturing.ems.cta.label}
                </Button>
                <a
                  href={`mailto:${site.email.sales}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-fog hover:text-white"
                >
                  <Boxes className="h-4 w-4 text-teal" />
                  {site.email.sales}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Divider />

      <CTABand
        title="Build your product on proven lines."
        intro="From build-to-print assembly to full product development partnerships — talk to a manufacturing partner with genuine engineering depth."
        primary={{ label: "Enquire about EMS partnership", href: "/contact" }}
        secondary={{ label: "About Telogica", href: "/about" }}
      />
    </>
  );
}
