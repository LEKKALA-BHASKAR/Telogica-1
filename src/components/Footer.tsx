import Link from "next/link";
import { Logo } from "./Brand";
import { site, nav } from "@/lib/site";
import { Mail, Phone, MapPin, Linkedin, Facebook, Youtube, ArrowUpRight } from "./Icons";

const solutions = [
  { label: "Telecommunication", href: "/solutions/telecommunication" },
  { label: "Railway", href: "/solutions/railway" },
  { label: "Defence & Military", href: "/solutions/defence" },
  { label: "All Products", href: "/products" },
];

const company = [
  { label: "About Us", href: "/about" },
  { label: "Clients", href: "/clients" },
  { label: "Investor Relations", href: "/investors" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-black text-fog">
      <div className="bg-dots absolute inset-0 opacity-30" />
      <div className="glow-blob absolute -left-20 top-10 h-72 w-72 opacity-20" />
      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
              {site.legalNote}. A semiconductor &amp; electronics equipment
              manufacturer serving telecom, railway and defence networks across
              India and beyond.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-fog">
                {site.iso}
              </span>
              <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-fog">
                {site.bse}
              </span>
            </div>
          </div>

          <FooterCol title="Solutions" links={solutions} />
          <FooterCol title="Company" links={company} />

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Get in touch
            </h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-grass" />
                <span className="text-fog">
                  {site.address.line1}, {site.address.line2}, {site.address.city}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-grass" />
                <a href={`tel:${site.phones[0].replace(/\s/g, "")}`} className="text-fog-bright hover:text-white">
                  {site.phones[0]}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 shrink-0 text-grass" />
                <a href={`mailto:${site.email.sales}`} className="text-fog-bright hover:text-white">
                  {site.email.sales}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              <Social href={site.social.linkedin}><Linkedin className="h-4 w-4" /></Social>
              <Social href={site.social.facebook}><Facebook className="h-4 w-4" /></Social>
              <Social href={site.social.youtube}><Youtube className="h-4 w-4" /></Social>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-7 text-xs text-fog-dim sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-white">{n.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h4>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group inline-flex items-center gap-1 text-fog hover:text-white">
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Social({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog transition-colors hover:border-grass hover:bg-grass hover:text-black"
    >
      {children}
    </a>
  );
}
