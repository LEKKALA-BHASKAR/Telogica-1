import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, Button } from "@/components/ui";
import { CTABand } from "@/components/CTABand";
import { InvestorDisclosures } from "@/components/InvestorDisclosures";
import { InvestorDocuments } from "@/components/InvestorDocuments";
import { site } from "@/lib/site";
import { bse } from "@/lib/bse";
import { investorsSeo, investorsIntro } from "@/lib/content";
import { Mail, Phone, ArrowUpRight } from "@/components/Icons";
import { BreadcrumbSchema } from "@/components/Seo";

export const metadata: Metadata = pageMetadata({
  title: investorsSeo.title,
  description: investorsSeo.description,
  path: "/investors",
});

const metric = (label: string, value: string | null, suffix = "") =>
  ({ label, value: value && value !== "0.00" ? value + suffix : "—" });

export default function InvestorsPage() {
  const { quote, company, fetchedAt } = bse;
  const up = parseFloat(quote.pcChg || "0") >= 0;

  const keyMetrics = [
    metric("EPS", company.eps),
    metric("P / E", company.pe),
    metric("P / B", company.pb),
    metric("RoE", company.roe, "%"),
    metric("Net Profit Margin", company.npm, "%"),
    metric("Face Value", company.faceValue ? `₹${company.faceValue}` : null),
  ];

  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "Home", href: "/" },
          { name: "Investor Relations", href: "/investors" },
        ]}
      />

      <PageHero
        eyebrow="Investor relations"
        title={<>Financial transparency &amp; <span className="text-gradient">LODR disclosures</span></>}
        intro={investorsIntro}
      />

      {/* Live market snapshot + key metrics */}
      <section className="container-x py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Quote card */}
          <Reveal>
            <div className="gradient-ring relative h-full overflow-hidden rounded-2xl bg-base-900 p-7">
              <div className="bg-dots absolute inset-0 opacity-30" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-xl font-bold text-white">{quote.name}</p>
                    <p className="mt-1 text-sm text-fog">
                      BSE: {quote.scrip} · ISIN {company.isin} · Group {company.group}
                    </p>
                  </div>
                  <span className="rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                    {quote.category || "Listed"}
                  </span>
                </div>

                <div className="mt-6 flex items-end gap-3">
                  <span className="font-display text-4xl font-bold text-white">₹{quote.ltp}</span>
                  <span className={`pb-1 text-sm font-semibold ${up ? "text-grass" : "text-red-400"}`}>
                    {up ? "▲" : "▼"} {quote.chg} ({quote.pcChg}%)
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                  {[
                    ["Open", quote.open],
                    ["High", quote.high],
                    ["Low", quote.low],
                    ["Prev", quote.prevClose],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-base-800 px-3 py-3 text-center">
                      <p className="text-[11px] uppercase tracking-wider text-fog-dim">{l}</p>
                      <p className="mt-0.5 text-sm font-semibold text-white">₹{v}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-fog-dim">
                  <span>As of {fetchedAt} · Source: BSE</span>
                  <a href={quote.bseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-teal hover:text-teal-400">
                    View on BSE <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Key metrics */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-line bg-base-800 p-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-teal">Key financials</p>
              <p className="mt-1 text-sm text-fog">{company.industry}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {keyMetrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-line bg-base-900 px-4 py-4">
                    <p className="font-display text-2xl font-bold text-white">{m.value}</p>
                    <p className="mt-1 text-xs font-medium text-fog">{m.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-fog-dim">
                Ratios as reported by BSE. Figures are indicative and may lag the latest filing.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LODR disclosures feed */}
      <section className="border-y border-line/60 bg-base-900">
        <div className="container-x py-16 sm:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="LODR disclosures"
              title={<>Statutory filings, <span className="text-gradient">live from BSE</span></>}
              intro="Regulation 30, 33, 31 and PIT disclosures — financial results, board meetings, AGM/EGM notices, insider-trading and corporate announcements. Each links to the original document on BSE."
            />
          </Reveal>
          <div className="mt-10">
            <InvestorDisclosures />
          </div>
        </div>
      </section>

      {/* Document libraries required under SEBI LODR */}
      <section className="container-x py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Document library"
            title={<>Statutory filings, <span className="text-gradient">section by section</span></>}
            intro="Annual reports, quarterly results, shareholding patterns, governance reports, policies and codes of conduct are maintained in our full investor document library."
          />
        </Reveal>
        <div className="mt-10">
          <InvestorDocuments />
        </div>
      </section>

      {/* IR contact */}
      <section className="container-x pb-16 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-base-800 p-8">
              <h3 className="font-display text-xl font-bold text-white">Filings on BSE</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-fog">
                Every intimation Telogica has filed under the LODR framework is
                also available in full on the exchange&rsquo;s own corporate
                announcements portal, alongside the documents published above.
              </p>
              <div className="mt-6">
                <Button href={quote.bseUrl} variant="outline">View filings on BSE</Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-base-800 p-8">
              <h3 className="font-display text-xl font-bold text-white">Investor relations contact</h3>
              <p className="mt-3 text-sm leading-relaxed text-fog">
                For shareholder services, filings or investor queries, reach our
                compliance and IR team directly.
              </p>
              <div className="mt-6 space-y-3">
                <a href={`mailto:${site.email.investors}`} className="flex items-center gap-3 rounded-xl border border-line bg-base-900 px-4 py-3 text-sm text-fog-bright hover:border-teal/50 hover:text-white">
                  <Mail className="h-4 w-4 text-teal" /> {site.email.investors}
                </a>
                <a href={`tel:${site.phones[1].replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 rounded-xl border border-line bg-base-900 px-4 py-3 text-sm text-fog-bright hover:border-teal/50 hover:text-white">
                  <Phone className="h-4 w-4 text-teal" /> {site.phones[1]}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand
        title="Have an investor query?"
        intro="Our compliance and IR team is ready to assist with filings, shareholder services and disclosures."
        primary={{ label: "Contact IR team", href: "/contact" }}
      />
    </>
  );
}
