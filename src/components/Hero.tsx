import { Button } from "./ui";
import { homeHero, trustBar } from "@/lib/content";

/**
 * Home hero: full-bleed manufacturing photograph, black-to-transparent wash on
 * the left so the copy stays legible, headline broken across three lines with
 * the last carrying the brand gradient. A trust bar closes the section.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/60 bg-black">
      <div className="absolute inset-0">
        {/* This is the LCP element. Intrinsic width/height reserve the box so
            the hero never shifts (CLS), and fetchPriority promotes it above the
            other subresources the browser discovers first. Images are served
            unoptimized (next.config.mjs), so a plain <img> is deliberate —
            next/image would add markup without adding a transform. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-pcb.webp"
          alt="Automated SMT pick-and-place machine populating a printed circuit board at Telogica's Hyderabad facility"
          width={1672}
          height={941}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        {/* Legibility wash. On narrow screens the copy spans the full width, so
            the whole photo is dimmed; from lg the fade returns to the left. */}
        <div className="absolute inset-0 bg-black/60 lg:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      <div className="container-x relative py-24 lg:py-32">
        <div className="max-w-3xl">
          <span className="eyebrow">
            {homeHero.eyebrow}
            <span className="h-px w-12 bg-gradient-to-r from-teal to-transparent" />
          </span>

          <h1 className="mt-7 font-display text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
            {homeHero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block text-gradient">{homeHero.titleAccent}</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-fog-bright sm:text-lg">
            {homeHero.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={homeHero.primary.href} variant="primary">
              {homeHero.primary.label}
            </Button>
            <Button href={homeHero.secondary.href} variant="outline">
              {homeHero.secondary.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="relative border-t border-line/60 bg-black/70 backdrop-blur">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-4 gap-y-3 py-5">
          {trustBar.map((item, i) => (
            <div key={item} className="flex items-center gap-4">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-teal" aria-hidden />}
              <span className="text-xs font-semibold uppercase tracking-wider text-fog-bright sm:text-sm">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
