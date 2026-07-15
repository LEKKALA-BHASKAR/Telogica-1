import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Button, SectionHeading } from "@/components/ui";
import { CTABand } from "@/components/CTABand";
import { ClientMarquee } from "@/components/ClientMarquee";
import {
  CapabilitySnapshot,
  MissionAreas,
  AmplifierHighlight,
  WhyDefense,
} from "@/components/DefenseSections";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Capability snapshot */}
      <CapabilitySnapshot />

      {/* Positioning statement */}
      <section className="container-x py-16 sm:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow justify-center">Two tiers, one partner</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Defense RF, from the component to the subsystem.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-fog">
              Telogica supplies the RF power that defense and aerospace missions
              depend on — benchtop and module amplifiers spanning 100&nbsp;MHz to
              40&nbsp;GHz, and the components that populate them. Programs can source
              the amplifier or the parts inside it from a single accountable partner,
              all held to one standard: wide bandwidth, high linearity and the
              reliability mission-critical systems require.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Mission areas / applications */}
      <section className="border-y border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Domains we serve"
              title={<>Where our RF <span className="text-gradient">powers the mission</span></>}
              intro="Thirteen defense and aerospace applications across four mission areas — each demanding wideband, linear, reliable RF."
            />
          </Reveal>
          <div className="mt-12">
            <MissionAreas />
          </div>
        </div>
      </section>

      {/* Flagship amplifier */}
      <AmplifierHighlight />

      {/* Why Telogica */}
      <section className="border-t border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Why Telogica"
              title={<>Measured rigor, mission fit</>}
              intro="Defense-grade RF engineered against the demands of contested spectrum — not commercial parts relabeled."
            />
          </Reveal>
          <div className="mt-12">
            <WhyDefense />
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="border-y border-line/60 bg-black py-16">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Trusted by"
              title={<>Powering India&rsquo;s most demanding organisations</>}
              intro="From space and defence research to national carriers and railways."
            />
          </Reveal>
        </div>
        <div className="mt-12">
          <ClientMarquee />
        </div>
        <div className="container-x mt-10 text-center">
          <Button href="/clients" variant="ghost">See all clients</Button>
        </div>
      </section>

      <CTABand
        title="Whatever your program needs across the spectrum."
        intro="The amplifier or the components inside it — Telogica delivers the RF behind radar, EW, SATCOM, and missile and UAV platforms."
        primary={{ label: "Request Capabilities Brief", href: "/contact" }}
        secondary={{ label: "Explore Capabilities", href: "/capabilities" }}
      />
    </>
  );
}
