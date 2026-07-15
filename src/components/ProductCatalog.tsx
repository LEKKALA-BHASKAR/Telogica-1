"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/products";

const filters = ["All", "Telecommunication", "Railway", "Defence"] as const;
type Filter = (typeof filters)[number];

const labels: Record<Filter, string> = {
  All: "All",
  Telecommunication: "Telecom",
  Railway: "Railway",
  Defence: "Defence",
};

export function ProductCatalog({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: products.length };
    for (const f of filters)
      if (f !== "All") c[f] = products.filter((p) => p.sectors.includes(f)).length;
    return c;
  }, [products]);

  const shown = useMemo(() => {
    let list = active === "All" ? products : products.filter((p) => p.sectors.includes(active));
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    return list;
  }, [active, query, products]);

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                active === f
                  ? "bg-teal text-white shadow-glow-teal"
                  : "border border-line bg-base-800 text-fog hover:border-teal/60 hover:text-white"
              }`}
            >
              {labels[f]}
              <span className={`rounded-full px-1.5 text-xs ${active === f ? "bg-white/25" : "bg-base-700 text-fog"}`}>
                {counts[f] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search instruments…"
            className="w-full rounded-full border border-line bg-base-800 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25"
          />
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <p className="mt-6 text-sm text-fog">
        Showing <span className="font-semibold text-white">{shown.length}</span> instrument{shown.length === 1 ? "" : "s"}
        {active === "All" && (
          <span className="ml-2 text-fog-dim">· many instruments serve more than one sector</span>
        )}
      </p>

      {shown.length ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line py-16 text-center text-fog">
          No instruments match your search.
        </div>
      )}
    </div>
  );
}
