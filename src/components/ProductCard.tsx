"use client";

import Link from "next/link";
import { cleanName } from "@/lib/format";
import type { ApiProduct } from "@/lib/types";
import { AddToCartButton, WishlistButton } from "./commerce/AddToCart";
import { PriceTag, StarRating } from "./commerce/Bits";
import { Shield } from "./Icons";

const catColor: Record<string, string> = {
  Telecommunication: "text-teal bg-teal/10 ring-1 ring-teal/20",
  Railway: "text-grass bg-grass/10 ring-1 ring-grass/20",
  Defence: "text-lime bg-lime/10 ring-1 ring-lime/20",
};

export function ProductCard({ product }: { product: ApiProduct }) {
  const img = product.images[0];
  const name = cleanName(product.name);
  const lowStock = !product.requiresQuote && product.stock > 0 && product.stock <= 5;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-base-800 transition-all duration-300 hover:-translate-y-1 hover:border-grass/40 hover:shadow-glow">
      <Link href={`/products/${product.slug}`} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-base-700 to-base-800">
          <div className="glow-teal absolute inset-x-6 bottom-0 top-8 opacity-25" />
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={name}
              loading="lazy"
              className="relative h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-fog-dim">No image</div>
          )}

          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${
              catColor[product.category] ?? "bg-base-600 text-fog"
            }`}
          >
            {product.category}
          </span>

          {product.requiresQuote ? (
            <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-teal backdrop-blur">
              Quote only
            </span>
          ) : product.stock < 1 ? (
            <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-red-300 backdrop-blur">
              Out of stock
            </span>
          ) : lowStock ? (
            <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-white transition-colors group-hover:text-grass">
            {name}
          </h3>
        </Link>

        <div className="mt-2">
          <StarRating value={product.rating} count={product.numReviews} size={14} />
        </div>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-fog">
          {product.shortDescription}
        </p>

        <div className="mt-4">
          <PriceTag price={product.price} mrp={product.mrp} requiresQuote={product.requiresQuote} />
        </div>

        {product.warrantyMonths ? (
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-fog">
            <Shield className="h-4 w-4 text-grass" />
            {product.warrantyMonths}-month warranty
          </span>
        ) : null}

        <div className="mt-4 flex items-center gap-2">
          <AddToCartButton product={product} className="flex-1 !py-2.5" compact />
          <WishlistButton productId={product._id} className="!h-10 !w-10" />
        </div>
      </div>
    </article>
  );
}
