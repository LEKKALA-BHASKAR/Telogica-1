import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";
import { contactSeo, contactIntro } from "@/lib/content";
import { Mail, Phone, MapPin, Clock, Linkedin, Facebook, Youtube } from "@/components/Icons";
import { BreadcrumbSchema } from "@/components/Seo";

export const metadata: Metadata = pageMetadata({
  title: contactSeo.title,
  description: contactSeo.description,
  path: "/contact",
});

const cards = [
  { icon: Mail, label: "Sales Inquiry", value: site.email.sales, href: `mailto:${site.email.sales}` },
  { icon: Mail, label: "Technical Support", value: site.email.support, href: `mailto:${site.email.support}` },
  { icon: Phone, label: "Call Us", value: site.phones[0], href: `tel:${site.phones[0].replace(/\s/g, "")}` },
  { icon: Clock, label: "Business Hours", value: site.hours },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        trail={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <PageHero
        eyebrow="Contact us"
        title={<>We respond within <span className="text-gradient">one working day</span></>}
        intro={contactIntro}
      />

      {/* Quick cards */}
      <section className="container-x py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <CardWrap href={c.href}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-black">
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm text-fog">{c.label}</p>
                <p className="mt-0.5 font-semibold text-white break-words">{c.value}</p>
              </CardWrap>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + info */}
      <section className="container-x grid gap-10 pb-16 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <Suspense fallback={<div className="rounded-2xl border border-line bg-base-800 p-8 shadow-card">Loading form…</div>}>
            <ContactForm />
          </Suspense>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-base-800 p-7 shadow-card">
              <h3 className="font-display text-lg font-bold text-white">Head Office</h3>
              <div className="mt-4 flex gap-3 text-sm text-fog">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                <span>
                  <span className="font-semibold text-white">TELOGICA LIMITED</span><br />
                  {site.address.line1}<br />
                  {site.address.line2}<br />
                  {site.address.city}
                </span>
              </div>
              <div className="mt-5 space-y-2 border-t border-line/60 pt-5 text-sm">
                {site.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 text-fog hover:text-white">
                    <Phone className="h-4 w-4 text-fog" /> {p}
                  </a>
                ))}
                <a href={`mailto:${site.email.sales}`} className="flex items-center gap-3 text-fog hover:text-white">
                  <Mail className="h-4 w-4 text-fog" /> {site.email.sales}
                </a>
              </div>
              <div className="mt-5 flex gap-3 border-t border-line/60 pt-5">
                <Social href={site.social.linkedin}><Linkedin className="h-4 w-4" /></Social>
                <Social href={site.social.facebook}><Facebook className="h-4 w-4" /></Social>
                <Social href={site.social.youtube}><Youtube className="h-4 w-4" /></Social>
              </div>
            </div>

            <a
              href={site.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-line shadow-card"
            >
              <div className="relative aspect-[16/10] bg-base-900">
                <div className="bg-grid absolute inset-0 opacity-40" />
                <div className="glow-blob absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <MapPin className="h-9 w-9 text-teal" />
                  <p className="mt-3 font-semibold">Jubilee Hills, Hyderabad</p>
                  <p className="mt-1 text-sm text-fog underline-offset-4 group-hover:underline">Open in Google Maps</p>
                </div>
              </div>
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function CardWrap({ href, children }: { href?: string; children: React.ReactNode }) {
  const cls = "block h-full rounded-2xl border border-line bg-base-800 p-6 shadow-card transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-glow";
  return href ? <a href={href} className={cls}>{children}</a> : <div className={cls}>{children}</div>;
}

function Social({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-teal hover:bg-teal hover:text-white">
      {children}
    </a>
  );
}
