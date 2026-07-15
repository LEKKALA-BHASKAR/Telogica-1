import { Button } from "./ui";
import { defenseHero } from "@/lib/defense";
import { Radar, Bolt, Satellite, Rocket } from "./Icons";

const chips = [
  { icon: Radar, label: "Radar & Sensing" },
  { icon: Bolt, label: "Electronic Warfare" },
  { icon: Satellite, label: "SATCOM & Mil-Comms" },
  { icon: Rocket, label: "Missile & UAV" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/60 bg-black">
      {/* background photo — RF / PCB electronics */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-pcb.webp"
          alt="Defense-grade RF electronics assembly"
          className="h-full w-full object-cover object-center"
        />
        {/* legibility wash — the photo already fades dark on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </div>

      <div className="container-x relative py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow">
            {defenseHero.eyebrow}
            <span className="h-px w-10 bg-gradient-to-r from-teal to-transparent" />
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-[4rem]">
            {defenseHero.titleLines[0]}
            <br />
            {defenseHero.titleLines[1]}
            <br />
            <span className="text-gradient">{defenseHero.titleAccent}</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-fog-bright">
            {defenseHero.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={defenseHero.primary.href} variant="primary">{defenseHero.primary.label}</Button>
            <Button href={defenseHero.secondary.href} variant="outline">{defenseHero.secondary.label}</Button>
          </div>

          {/* domain chips */}
          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {chips.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-line bg-base-900/70 px-3 py-4 text-center backdrop-blur"
              >
                <c.icon className="h-6 w-6 text-teal" />
                <span className="text-sm font-semibold leading-tight text-white">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
