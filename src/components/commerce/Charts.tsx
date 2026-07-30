"use client";

import { formatCompactPrice } from "@/lib/format";

/**
 * Dependency-free SVG charts. The palette matches the brand gradient so the
 * dashboard reads as one system with the rest of the site.
 */

export function RevenueBars({
  data,
  height = 180,
}: {
  data: { month: string; revenue: number; orders: number }[];
  height?: number;
}) {
  if (!data.length) {
    return (
      <p className="flex h-[180px] items-center justify-center text-sm text-fog-dim">
        No revenue recorded yet
      </p>
    );
  }

  // The API only returns months that had orders; pad the rest so the axis
  // always reads as a full year rather than a single floating bar.
  const byMonth = new Map(data.map((d) => [d.month, d]));
  const now = new Date();
  const series = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return byMonth.get(key) ?? { month: key, revenue: 0, orders: 0 };
  });

  const max = Math.max(...series.map((d) => d.revenue), 1);

  return (
    <div>
      {/* No `items-end` here: the columns must stretch so each bar's
          percentage height resolves against the full chart height. */}
      <div className="flex gap-2" style={{ height }}>
        {series.map((d) => {
          const pct = (d.revenue / max) * 100;
          const [year, month] = d.month.split("-");
          const label = new Date(Number(year), Number(month) - 1).toLocaleDateString("en-IN", {
            month: "short",
          });

          return (
            <div key={d.month} className="group relative flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    d.revenue > 0
                      ? "bg-brand-gradient-v opacity-80 group-hover:opacity-100"
                      : "bg-base-700"
                  }`}
                  style={{ height: d.revenue > 0 ? `${Math.max(pct, 3)}%` : "3px" }}
                />
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-base-800 px-2.5 py-1.5 text-xs shadow-card group-hover:block">
                  <span className="font-semibold text-white">
                    {formatCompactPrice(d.revenue)}
                  </span>
                  <span className="ml-1.5 text-fog">
                    · {d.orders} order{d.orders === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-medium text-fog-dim">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StatusDonut({ byStatus }: { byStatus: Record<string, number> }) {
  const palette: Record<string, string> = {
    pending: "#f59e0b",
    processing: "#0BAEC9",
    packed: "#16C0A8",
    shipped: "#818cf8",
    delivered: "#5EBE89",
    cancelled: "#f87171",
    refunded: "#6C7771",
  };

  const entries = Object.entries(byStatus).filter(([, count]) => count > 0);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (!total) {
    return <p className="py-10 text-center text-sm text-fog-dim">No orders yet</p>;
  }

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-8">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90" role="img" aria-label="Orders by status">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#161A18" strokeWidth="16" />
        {entries.map(([status, count]) => {
          const fraction = count / total;
          const dash = fraction * circumference;
          const el = (
            <circle
              key={status}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={palette[status] ?? "#6C7771"}
              strokeWidth="16"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>

      <ul className="flex-1 space-y-2 text-sm">
        {entries.map(([status, count]) => (
          <li key={status} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: palette[status] ?? "#6C7771" }}
            />
            <span className="flex-1 capitalize text-fog">{status}</span>
            <span className="font-semibold text-white">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "positive" | "warn";
}) {
  const toneClass =
    tone === "positive" ? "text-grass" : tone === "warn" ? "text-amber-300" : "text-white";

  return (
    <div className="rounded-2xl border border-line bg-base-900 p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-fog">{label}</p>
      <p className={`mt-2.5 font-display text-2xl font-bold ${toneClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-fog-dim">{sub}</p>}
    </div>
  );
}
