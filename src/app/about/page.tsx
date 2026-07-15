import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Button, SectionHeading, Eyebrow, Divider } from "@/components/ui";
import { CTABand } from "@/components/CTABand";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";
import { Award, Globe, TrendingUp, Factory, Signal, Shield, Check } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Telogica Limited (formerly Aishwarya Technologies and Telecom Ltd) is an ISO 9001:2015 certified design and manufacturing company serving India's defence and telecom industries.",
};

const resources = [
  { value: "9", label: "R&D Personnel", note: "Continuous innovation & development" },
  { value: "4", label: "Customer Support", note: "Technical operations & client support" },
  { value: "20", label: "Marketing Team", note: "Strategic growth & business expansion" },
  { value: "45", label: "Production Staff", note: "Precision sourcing & quality manufacturing" },
];

const pedigree = [
  "BSNL", "Bharti Airtel", "Tata Tele Services", "Reliance Communications",
  "MTNL", "Indian Railways", "Defence Sectors",
];

const segments = [
  {
    icon: Signal,
    title: "Telecommunication",
    text: "Nation-wide services to business, industry and government with cutting-edge telecom testing tools.",
    points: ["Test & measuring equipment", "Network analyzers", "Cable fault locators"],
  },
  {
    icon: Shield,
    title: "Defence Applications",
    text: "A pioneer in electronics & communication technology with a proven domestic track record in critical military systems.",
    points: ["Military-grade sourcing", "Secure communication hardware", "Advanced signal analyzers"],
  },
  {
    icon: Factory,
    title: "Advanced Manufacturing",
    text: "A state-of-the-art facility producing robust diagnostic equipment to tight international benchmarks.",
    points: ["ISO 9001:2015 assurance", "Custom engineering & splicing tools", "Strict testing & calibration"],
  },
];

const future = [
  { icon: Globe, title: "Global Expansion", text: "Exporting critical measuring products and securing valuable international supply partnerships." },
  { icon: TrendingUp, title: "Innovation Hub", text: "Focused R&D to build advanced, modular vector analyzers and splicing hardware." },
  { icon: Award, title: "Qualitative Leadership", text: "Maintaining strict ISO compliance to consolidate our reputation as a qualitative trendsetter." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title={<>The RF that keeps missions <span className="text-gradient">running</span></>}
        intro={`${site.legalNote}, Telogica supplies the RF equipment and components that keep defense and aerospace missions running — held to one standard of wide bandwidth, high linearity and reliability.`}
      />

      {/* Story + numbers */}
      <section className="container-x py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Two tiers, one partner</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white">
              From the component to the complete subsystem.
            </h2>
            <div className="mt-5 space-y-4 text-fog">
              <p>
                Telogica works at two levels: the RF power amplifiers and
                subsystems that defense programs field, and the RF components —
                spanning 100&nbsp;MHz to 40&nbsp;GHz — that go inside them. That dual
                reach lets a single partner support a program from component through
                subsystem.
              </p>
              <p>
                In benchtop and module form factors and across output-power levels,
                every amplifier is held to one standard: wide bandwidth, high
                linearity, and the reliability mission-critical systems require.
              </p>
              <p className="font-medium text-white">
                The standard traces to our foundation in RF test and measurement —
                we don&rsquo;t just claim performance, we measure it.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-5">
              <BigStat value="75+" label="Team members" />
              <BigStat value="9+" label="R&D personnel" />
              <BigStat value="30+" label="Years in industry" />
              <BigStat value="ISO" label="9001:2015 certified" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Resources */}
      <section className="border-y border-line/60 bg-base-900 py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Our resources"
              title="A 75-strong team from India's finest institutions"
              intro="Combining expertise from reputed Indian universities with deep industry experience."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((r, i) => (
              <Reveal key={r.label} delay={i * 0.06}>
                <div className="gradient-ring h-full rounded-2xl bg-base-800 p-6">
                  <p className="font-display text-4xl font-bold text-gradient">{r.value}</p>
                  <p className="mt-2 font-semibold text-white">{r.label}</p>
                  <p className="mt-1 text-sm text-fog">{r.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 rounded-2xl border border-line bg-base-800 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-fog">
                Our people come from
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {pedigree.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-base-900 px-3.5 py-1.5 text-sm font-medium text-white">
                    <Check className="h-3.5 w-3.5 text-teal" />{p}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Business segments */}
      <section className="container-x py-16 sm:py-24">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Business segments"
            title="Specialised technology across diverse sectors"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {segments.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-base-800 p-7 shadow-card">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">{s.text}</p>
                <ul className="mt-5 space-y-2.5 border-t border-line/60 pt-5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-white">
                      <Check className="h-4 w-4 shrink-0 text-teal" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Future plans — dark */}
      <section className="relative overflow-hidden bg-base-900 py-20 text-white">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="glow-blob absolute left-1/3 top-0 h-80 w-80 opacity-30" />
        <div className="container-x relative">
          <Reveal>
            <SectionHeading eyebrow="Strategic vision" title="Our future plans" align="center"
              intro="Telogica is keen to expand its boundaries and establish a strong manufacturing and supply presence across other countries." />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {future.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                  <f.icon className="h-7 w-7 text-teal" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog-dim">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/contact" variant="gradient">Partner with us</Button>
          </div>
        </div>
      </section>

      <Divider />
      <CTABand
        title="Visit our Hyderabad facility"
        intro="Experience domestic innovation and rigorous engineering firsthand at our main facility in Jubilee Hills."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "View products", href: "/products" }}
      />
    </>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-base-800 p-6 text-center shadow-card">
      <p className="font-display text-4xl font-bold text-gradient">{value}</p>
      <p className="mt-1.5 text-sm font-medium text-fog">{label}</p>
    </div>
  );
}
