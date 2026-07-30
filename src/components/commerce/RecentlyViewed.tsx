"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cleanName, formatPrice } from "@/lib/format";
import type { ApiProduct } from "@/lib/types";

const KEY = "telogica.recent.v1";
const MAX = 8;

interface RecentEntry {
  slug: string;
  name: string;
  image: string;
  price: number;
  requiresQuote: boolean;
}

function read(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as RecentEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Records a product view. Rendered (invisibly) on every product page. */
export function TrackProductView({ product }: { product: ApiProduct }) {
  useEffect(() => {
    const entry: RecentEntry = {
      slug: product.slug,
      name: cleanName(product.name),
      image: product.images[0] ?? "",
      price: product.price,
      requiresQuote: product.requiresQuote,
    };
    // Most recent first, no duplicates, capped.
    const next = [entry, ...read().filter((e) => e.slug !== entry.slug)].slice(0, MAX);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Private browsing — a missing history is not worth surfacing.
    }
  }, [product]);

  return null;
}

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const [items, setItems] = useState<RecentEntry[]>([]);

  useEffect(() => {
    setItems(read().filter((e) => e.slug !== excludeSlug));
  }, [excludeSlug]);

  if (items.length < 2) return null;

  return (
    <section className="container-x border-t border-line/60 py-12">
      <h2 className="font-display text-xl font-bold text-white">Recently viewed</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/products/${item.slug}`}
            className="group w-40 shrink-0 rounded-xl border border-line bg-base-900 p-3 transition hover:border-teal/40"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-base-800">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
            <p className="mt-2.5 line-clamp-2 text-xs font-medium leading-snug text-white">
              {item.name}
            </p>
            <p className="mt-1 text-xs font-semibold text-teal">
              {item.requiresQuote ? "On request" : formatPrice(item.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
