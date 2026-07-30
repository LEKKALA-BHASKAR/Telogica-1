/** Display helpers shared by the storefront and the admin panel. */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number, precise = false): string {
  if (!Number.isFinite(value)) return "—";
  return precise ? inrPrecise.format(value) : inr.format(value);
}

/** Compact money for dashboard tiles: ₹4.2L, ₹1.3Cr. */
export function formatCompactPrice(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  return inr.format(value);
}

export function formatDate(value?: string | Date, withTime = false): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function discountPercent(mrp: number, price: number): number {
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/** Collapses the tabs and double spaces present in the imported catalogue names. */
export function cleanName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300 ring-amber-500/25",
  processing: "bg-cyan/10 text-cyan ring-cyan/25",
  packed: "bg-teal/10 text-teal-400 ring-teal/25",
  shipped: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/25",
  delivered: "bg-grass/10 text-grass ring-grass/25",
  cancelled: "bg-red-500/10 text-red-300 ring-red-500/25",
  refunded: "bg-fog/10 text-fog ring-fog/25",
  new: "bg-cyan/10 text-cyan ring-cyan/25",
  in_review: "bg-amber-500/10 text-amber-300 ring-amber-500/25",
  quoted: "bg-teal/10 text-teal-400 ring-teal/25",
  won: "bg-grass/10 text-grass ring-grass/25",
  lost: "bg-red-500/10 text-red-300 ring-red-500/25",
  read: "bg-fog/10 text-fog-bright ring-fog/25",
  replied: "bg-grass/10 text-grass ring-grass/25",
  archived: "bg-fog/10 text-fog ring-fog/25",
};

export function statusTone(status: string): string {
  return STATUS_TONE[status] ?? "bg-base-700 text-fog ring-line";
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
