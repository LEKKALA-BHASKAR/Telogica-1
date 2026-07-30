"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { EmptyState, Pagination, ProductGridSkeleton } from "./commerce/Bits";
import { apiGetWithMeta, toApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { ApiProduct, Category, PageMeta } from "@/lib/types";
import { Search, Warning } from "./Icons";

const sectors = ["All", "Telecommunication", "Railway", "Defence"] as const;
type Sector = (typeof sectors)[number];

const labels: Record<Sector, string> = {
  All: "All",
  Telecommunication: "Telecom",
  Railway: "Railway",
  Defence: "Defence",
};

const sortOptions = [
  { value: "relevance", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Best rated" },
  { value: "popular", label: "Best selling" },
  { value: "name", label: "Name A–Z" },
  { value: "newest", label: "Newest" },
];

interface Facets {
  sectors: { name: Category; count: number }[];
  priceRange: { min: number; max: number };
  counts: { total: number; buyable: number; quoteOnly: number };
}

const PAGE_SIZE = 12;

export function ProductCatalog() {
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [facets, setFacets] = useState<Facets | null>(null);

  const [sector, setSector] = useState<Sector>("All");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sort, setSort] = useState("relevance");
  const [buyableOnly, setBuyableOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<HTMLParagraphElement>(null);

  // Debounce typing so a search doesn't fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  // Any filter change resets to the first page.
  useEffect(() => {
    setPage(1);
  }, [sector, debouncedQuery, sort, buyableOnly, inStockOnly]);

  useEffect(() => {
    apiGetWithMeta<Facets>("/products/facets")
      .then(({ data }) => setFacets(data))
      .catch(() => setFacets(null));
  }, []);

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sort,
      ...(sector !== "All" ? { sector } : {}),
      ...(debouncedQuery ? { q: debouncedQuery } : {}),
      ...(buyableOnly ? { buyable: true } : {}),
      ...(inStockOnly ? { inStock: true } : {}),
    }),
    [page, sort, sector, debouncedQuery, buyableOnly, inStockOnly]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta: pageMeta } = await apiGetWithMeta<{ items: ApiProduct[] }>(
        "/products",
        params
      );
      setItems(data.items);
      setMeta(pageMeta ?? null);
    } catch (err) {
      setError(toApiError(err).message);
      setItems([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  const sectorCount = (name: Sector) =>
    name === "All" ? facets?.counts.total : facets?.sectors.find((s) => s.name === name)?.count;

  function goToPage(next: number) {
    setPage(next);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => {
            const count = sectorCount(s);
            return (
              <button
                key={s}
                onClick={() => setSector(s)}
                aria-pressed={sector === s}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  sector === s
                    ? "bg-teal text-white shadow-glow-teal"
                    : "border border-line bg-base-800 text-fog hover:border-teal/60 hover:text-white"
                }`}
              >
                {labels[s]}
                {count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 text-xs ${
                      sector === s ? "bg-white/25" : "bg-base-700 text-fog"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search instruments…"
              aria-label="Search products"
              className="w-full rounded-full border border-line bg-base-800 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/25"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-dim" />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
            className="rounded-full border border-line bg-base-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-teal"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fog">
          <input
            type="checkbox"
            checked={buyableOnly}
            onChange={(e) => setBuyableOnly(e.target.checked)}
            className="h-4 w-4 rounded border-line bg-base-800 accent-teal"
          />
          Buy online only
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fog">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-line bg-base-800 accent-teal"
          />
          In stock only
        </label>
        {facets && facets.priceRange.max > 0 && (
          <span className="text-sm text-fog-dim">
            Prices from {formatPrice(facets.priceRange.min)} to {formatPrice(facets.priceRange.max)}
          </span>
        )}
      </div>

      <p className="mt-6 text-sm text-fog" ref={gridRef}>
        {meta ? (
          <>
            Showing <span className="font-semibold text-white">{items.length}</span> of{" "}
            <span className="font-semibold text-white">{meta.total}</span> instrument
            {meta.total === 1 ? "" : "s"}
            {sector === "All" && (
              <span className="ml-2 text-fog-dim">· many instruments serve more than one sector</span>
            )}
          </>
        ) : (
          "Loading catalogue…"
        )}
      </p>

      {error ? (
        <div className="mt-8 rounded-2xl border border-red-500/25 bg-red-500/5 px-6 py-12 text-center">
          <Warning className="mx-auto h-8 w-8 text-red-300" />
          <p className="mt-3 text-sm text-red-200">{error}</p>
          <button
            onClick={() => void load()}
            className="mt-5 rounded-md border border-line bg-base-800 px-4 py-2 text-sm font-semibold text-white hover:border-teal/50"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <ProductGridSkeleton />
      ) : items.length ? (
        <>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {meta && <Pagination page={meta.page} pages={meta.pages} onChange={goToPage} />}
        </>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No instruments match your search"
            intro="Try a different keyword or clear the filters — we supply a far wider range than the catalogue shows."
            action={{ label: "Request a quote", href: "/contact" }}
          />
        </div>
      )}
    </div>
  );
}
