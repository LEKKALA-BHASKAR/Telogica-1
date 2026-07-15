import { Reveal } from "./Reveal";
import { SectionHeading, Button } from "./ui";
import { snapshot, missionAreas, whyDefense, amplifier } from "@/lib/defense";
import {
  Radar, Bolt, Satellite, Rocket, Layers, Wave, Microscope, Shield, Waveform, Check, Crosshair,
} from "./Icons";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Radar, Bolt, Satellite, Rocket, Layers, Wave, Microscope, Shield,
};

/** Capability-snapshot strip (frequency, form factors, power, performance). */
export function CapabilitySnapshot() {
  return (
    <section className="border-b border-line/60 bg-black">
      <div className="container-x grid grid-cols-2 gap-y-10 py-14 lg:grid-cols-4">
        {snapshot.map((s) => (
          <div key={s.label} className="px-4 text-center">
            <p className="font-display text-2xl font-bold text-teal sm:text-3xl">{s.value}</p>
            <p className="mt-2 text-sm font-medium text-fog">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Four mission areas, each listing its real applications. */
export function MissionAreas({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {missionAreas.map((m, i) => {
        const Icon = iconMap[m.icon] ?? Crosshair;
        return (
          <Reveal key={m.key} delay={i * 0.07}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-base-800 p-7 transition-colors hover:border-teal/40">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-black">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-bold text-white">{m.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-fog">{m.blurb}</p>
              {!compact && (
                <ul className="mt-5 grid gap-2.5 border-t border-line/60 pt-5 sm:grid-cols-2">
                  {m.apps.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-fog-bright">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** Flagship RF power amplifier highlight. */
export function AmplifierHighlight() {
  return (
    <section className="container-x py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Flagship line"
            title={<>RF Power Amplifiers, <span className="text-gradient">100 MHz to 40 GHz</span></>}
            intro={amplifier.summary}
          />
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {amplifier.performance.map((p) => (
              <div key={p} className="flex items-center gap-2.5 rounded-lg border border-line bg-base-800 px-4 py-3 text-sm text-fog-bright">
                <Check className="h-4 w-4 shrink-0 text-teal" />
                {p}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact" variant="primary">Request a Quote</Button>
            <Button href="/capabilities" variant="outline">Full capabilities</Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="gradient-ring relative overflow-hidden rounded-2xl bg-base-900 p-8">
            <div className="bg-grid absolute inset-0 opacity-40" />
            <div className="glow-teal absolute -right-10 -top-10 h-56 w-56 opacity-40" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-black">
                  <Waveform className="h-6 w-6" />
                </span>
                <span className="font-mono text-xs tracking-widest text-teal">RF / µW</span>
              </div>
              {/* stylised spectrum bars */}
              <div className="mt-8 flex h-40 items-end gap-1.5">
                {[30, 52, 44, 68, 90, 74, 58, 82, 64, 96, 70, 48, 60, 38, 55].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-teal/30 to-teal"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line/60 pt-6 text-center">
                <div>
                  <p className="font-display text-xl font-bold text-white">40<span className="text-sm text-fog"> GHz</span></p>
                  <p className="text-xs text-fog">max frequency</p>
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-white">2</p>
                  <p className="text-xs text-fog">form factors</p>
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-white">13</p>
                  <p className="text-xs text-fog">applications</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Why-Telogica pillars for the defense reposition. */
export function WhyDefense() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {whyDefense.map((w, i) => {
        const Icon = iconMap[w.icon] ?? Layers;
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
