import type { ReactNode } from "react";

/** Dark hero used across inner pages. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line/60 bg-black">
      <div className="vignette absolute inset-0" />
      <div className="bg-dots absolute inset-0 opacity-40" />
      <div className="glow-blob absolute -top-24 right-1/4 h-80 w-80 opacity-40" />
      <div className="container-x relative py-20 sm:py-24">
        <div className="max-w-3xl">
          <span className="eyebrow">
            <span className="h-px w-6 bg-gradient-to-r from-teal to-grass" />
            {eyebrow}
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
