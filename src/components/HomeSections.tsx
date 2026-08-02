import Link from "next/link";
import { Reveal } from "./Reveal";
import { whatWeDo, whyTelogica, featuredProducts } from "@/lib/content";
import {
  Signal, Train, Shield, Factory, ShieldCheck, Wrench, Award, ArrowRight, Waveform,
} from "./Icons";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Signal, Train, Shield, Factory, ShieldCheck, Wrench, Award,
};

/** "What We Do" — three sector columns, each linking to its industry page. */
export function WhatWeDo() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {whatWeDo.map((c, i) => {
        const Icon = iconMap[c.icon] ?? Signal;
        return (
          <Reveal key={c.key} delay={i * 0.08}>
            <Link
              href={c.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-base-800 p-7 shadow-card transition-all hover:-translate-y-1 hover:border-teal/40 hover:shadow-glow"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-white">{c.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-fog">{c.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-teal">
                Explore {c.title}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

/** "Why Telogica" — four differentiator pillars. */
export function WhyTelogica() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {whyTelogica.map((w, i) => {
        const Icon = iconMap[w.icon] ?? Award;
        return (
          <Reveal key={w.title} delay={i * 0.07}>
            <div className="h-full rounded-2xl border border-line bg-base-800 p-6 transition-colors hover:border-teal/40">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-white">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">{w.text}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** Featured product families — a scroll strip on narrow screens, grid from sm. */
export function FeaturedProducts() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {featuredProducts.map((p, i) => (
        <Reveal key={p.name} delay={(i % 3) * 0.06}>
          <Link
            href={p.href}
            className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-base-800 p-5 transition-all hover:-translate-y-0.5 hover:border-teal/40"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-teal/30 bg-teal/10 text-teal">
              <Waveform className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold leading-snug text-white">{p.name}</span>
              <span className="mt-0.5 block text-sm text-fog">{p.note}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-fog-dim transition-transform group-hover:translate-x-1 group-hover:text-teal" />
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
