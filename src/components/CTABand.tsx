import { Button } from "./ui";
import { WaveDivider } from "./Brand";

export function CTABand({
  title = "Let's manufacture your next system — with precision.",
  intro = "Talk to our engineers about custom electronics manufacturing, assembly and test instrumentation for your telecom, railway or defence programme.",
  primary = { label: "Request a Quote", href: "/contact" },
  secondary,
}: {
  title?: string;
  intro?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="container-x py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-base-900 px-7 py-14 sm:px-14">
        <div className="bg-dots absolute inset-0 opacity-40" />
        <div className="glow-blob absolute -right-10 -top-10 h-72 w-72 opacity-50" />
        <div className="glow-teal absolute -bottom-16 left-10 h-64 w-64 opacity-40" />
        <div className="relative mx-auto max-w-2xl text-center">
          <WaveDivider className="mx-auto h-5 w-20" />
          <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fog">{intro}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={primary.href} variant="primary">{primary.label}</Button>
            {secondary && (
              <Button href={secondary.href} variant="outline">{secondary.label}</Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
