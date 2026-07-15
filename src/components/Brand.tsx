import Link from "next/link";

/** Telogica wordmark — official asset (white variant for the dark theme). */
export function Logo({
  className = "",
  variant = "color",
}: {
  className?: string;
  variant?: "white" | "color";
}) {
  return (
    <Link href="/" className={`group inline-flex items-center ${className}`} aria-label="Telogica home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={variant === "white" ? "/logo-white.png" : "/logo-color.png"}
        alt="Telogica"
        className="h-8 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </Link>
  );
}

/** Just the T+wave mark (used as a small brand accent). */
export function WaveMark({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/icon.svg" alt="" aria-hidden="true" className={className} />;
}

/** Decorative gradient wave divider (replaces the old infinity mark). */
export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 18" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="tg-div" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16C0A8" />
          <stop offset="0.55" stopColor="#45C98C" />
          <stop offset="1" stopColor="#84CC16" />
        </linearGradient>
      </defs>
      <path
        d="M2 9c6-7 12-7 18 0s12 7 18 0 12-7 18 0 12 7 18 0"
        stroke="url(#tg-div)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Back-compat alias used by older imports. */
export const InfinityMark = WaveDivider;
