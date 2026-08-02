import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Button, SectionHeading } from "@/components/ui";
import { CTABand } from "@/components/CTABand";
import { ClientMarquee } from "@/components/ClientMarquee";
import { WhatWeDo, WhyTelogica, FeaturedProducts } from "@/components/HomeSections";
import { whoWeAre, homeCta } from "@/lib/content";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Who We Are */}
      <section className="container-x py-16 sm:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow justify-center">{whoWeAre.eyebrow}</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              {whoWeAre.title}
            </h2>
            {whoWeAre.body.map((p) => (
              <p key={p.slice(0, 40)} className="mt-5 text-lg leading-relaxed text-fog">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* What We Do — three sectors */}
      <section className="border-y border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title={<>Three sectors, one <span className="text-gradient">engineering standard</span></>}
              intro="Telecom, railways and defence — each served from the same Hyderabad design and manufacturing floor."
            />
          </Reveal>
          <div className="mt-12">
            <WhatWeDo />
          </div>
        </div>
      </section>

      {/* Why Telogica */}
      <section className="container-x py-16 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Why Telogica"
            title={<>Built here, proven here, supported here</>}
            intro="Design-to-delivery in India, with the accountability of a listed company and the support network instruments in the field depend on."
          />
        </Reveal>
        <div className="mt-12">
          <WhyTelogica />
        </div>
      </section>

      {/* Featured products */}
      <section className="border-y border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Featured products"
              title={<>Instruments engineered for <span className="text-gradient">precision</span></>}
              intro="From RF power amplifiers to the fibre and copper toolkit India's network engineers carry every day."
            />
          </Reveal>
          <div className="mt-12">
            <FeaturedProducts />
          </div>
          <div className="mt-10 text-center">
            <Button href="/products" variant="outline">View the full catalogue</Button>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="border-b border-line/60 bg-black py-16">
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
        title={homeCta.title}
        intro={homeCta.intro}
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: site.email.sales, href: `mailto:${site.email.sales}` }}
      />
    </>
  );
}
