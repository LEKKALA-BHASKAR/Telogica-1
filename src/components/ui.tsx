import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./Icons";
import { WaveDivider } from "./Brand";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "gradient";
  className?: string;
  icon?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  icon = true,
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-all duration-200";
  const styles: Record<string, string> = {
    primary: "bg-teal text-white hover:bg-teal-600 shadow-glow-teal",
    gradient: "bg-brand-gradient text-black hover:brightness-110 shadow-glow",
    outline: "border border-line-strong bg-base-800/60 text-white hover:border-teal/60 hover:bg-base-700",
    ghost: "text-fog hover:text-white",
  };
  const external = href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel");
  const inner = (
    <>
      {children}
      {icon && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} className={`${base} ${styles[variant]} ${className}`}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {inner}
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      {children}
      <span className="h-px w-8 bg-gradient-to-r from-teal to-transparent" />
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  /** kept for back-compat; the whole site is dark now */
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-base leading-relaxed text-fog">{intro}</p>}
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-line-strong" />
      <WaveDivider className="h-4 w-16" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-line-strong" />
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-base-800 px-3 py-1 text-xs font-semibold text-fog">
      {children}
    </span>
  );
}
