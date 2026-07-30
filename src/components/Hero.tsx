import { Button } from "./ui";
import { manufacturingHero } from "@/lib/defense";

/**
 * Home hero: full-bleed manufacturing photograph, black-to-transparent wash on
 * the left so the copy stays legible, headline broken across four lines with
 * the last two carrying the brand gradient.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/60 bg-black">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-pcb.webp"
          alt="Automated SMT pick-and-place machine populating a printed circuit board"
          className="h-full w-full object-cover object-center"
        />
        {/* Legibility wash. On narrow screens the copy spans the full width, so
            the whole photo is dimmed; from lg the fade returns to the left. */}
        <div className="absolute inset-0 bg-black/60 lg:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      <div className="container-x relative py-24 lg:py-32">
        <div className="max-w-2xl">
          <span className="eyebrow">
            {manufacturingHero.eyebrow}
            <span className="h-px w-12 bg-gradient-to-r from-teal to-transparent" />
          </span>

          <h1 className="mt-7 font-display text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            {manufacturingHero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block text-gradient">{manufacturingHero.titleAccent}</span>
            <span className="block text-gradient">{manufacturingHero.titleAccentTwo}</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-fog-bright sm:text-lg">
            {manufacturingHero.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={manufacturingHero.primary.href} variant="primary">
              {manufacturingHero.primary.label}
            </Button>
            <Button href={manufacturingHero.secondary.href} variant="outline">
              {manufacturingHero.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
