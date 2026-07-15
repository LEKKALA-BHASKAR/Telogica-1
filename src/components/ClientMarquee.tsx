import { clients } from "@/lib/products";

export function ClientMarquee() {
  const row = [...clients, ...clients];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-6 py-2">
        {row.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl border border-line bg-white/95 px-4 transition hover:border-grass/40"
            title={c.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.logo as string}
              alt={c.name}
              loading="lazy"
              className="max-h-12 max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
