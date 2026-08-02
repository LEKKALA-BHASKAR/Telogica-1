import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Eyebrow, Divider } from "@/components/ui";
import { CTABand } from "@/components/CTABand";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";
import { BreadcrumbSchema } from "@/components/Seo";
import {
  aboutSeo, aboutHero, ourStory, missionVision, whatSetsUsApart, qualityCopy, milestones,
} from "@/lib/content";
import {
  Award, Factory, Users, FileText, ShieldCheck, Check, Target, Globe,
} from "@/components/Icons";

export const metadata: Metadata = pageMetadata({
  title: aboutSeo.title,
  description: aboutSeo.description,
  path: "/about",
});

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Factory, Users, FileText, Award,
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <PageHero
        eyebrow={aboutHero.eyebrow}
        title={
          <>
            Designed and manufactured in India,{" "}
            <span className="text-gradient">for India and the world</span>
          </>
        }
        intro={aboutHero.intro}
      />

      {/* Our story */}
      <section className="container-x py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white">
              From telecom test benches to defence-grade RF.
            </h2>
            <div className="mt-5 space-y-4 text-fog">
              {ourStory.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-5">
              <BigStat value="BSE" label={site.bse.replace("BSE: ", "Scrip ")} />
              <BigStat value="ISO" label="9001:2015 certified" />
              <BigStat value="3" label="Sectors served" />
              <BigStat value="40 GHz" label="Top of our RF range" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="border-y border-line/60 bg-base-900 py-16 sm:py-20">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          {missionVision.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <div className="gradient-ring h-full rounded-2xl bg-base-800 p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                  {i === 0 ? <Target className="h-6 w-6" /> : <Globe className="h-6 w-6" />}
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-white">{m.label}</h2>
                <p className="mt-3 leading-relaxed text-fog">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What sets us apart */}
      <section className="container-x py-16 sm:py-24">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="What sets us apart"
            title="Engineering depth, end to end"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whatSetsUsApart.map((s, i) => {
            const Icon = iconMap[s.icon] ?? Award;
            return (
              <Reveal key={s.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-line bg-base-800 p-6 transition-colors hover:border-teal/40">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Quality & certifications */}
      <section className="border-y border-line/60 bg-base-900 py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <Eyebrow>Quality</Eyebrow>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white">
                  {qualityCopy.title}
                </h2>
              </div>
              <div className="rounded-2xl border border-line bg-base-800 p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <p className="mt-5 leading-relaxed text-fog">{qualityCopy.body}</p>
                <div className="mt-6 flex flex-wrap gap-2.5 border-t border-line/60 pt-6">
                  {[site.iso, site.bse, "Made in India"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-base-900 px-3.5 py-1.5 text-sm font-medium text-white"
                    >
                      <Check className="h-3.5 w-3.5 text-teal" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Milestones */}
      <section className="container-x py-16 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Milestones"
            title={<>Two decades of <span className="text-gradient">engineering in India</span></>}
          />
        </Reveal>
        <ol className="mt-12 space-y-0 border-l border-line pl-8">
          {milestones.map((m, i) => (
            <Reveal key={m.title} delay={(i % 4) * 0.06}>
              <li className="relative pb-9 last:pb-0">
                <span className="absolute -left-[41px] top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-teal bg-black">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                </span>
                {m.year && (
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-teal">
                    {m.year}
                  </p>
                )}
                <p className="text-base font-medium leading-relaxed text-fog-bright">{m.title}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <Divider />

      <CTABand
        title="Visit our Hyderabad facility"
        intro="See the full product lifecycle — R&D, manufacturing, testing and calibration — under one roof in Jubilee Hills."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "Manufacturing & R&D", href: "/manufacturing" }}
      />
    </>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-base-800 p-6 text-center shadow-card">
      <p className="font-display text-3xl font-bold text-gradient">{value}</p>
      <p className="mt-1.5 text-sm font-medium text-fog">{label}</p>
    </div>
  );
}
