import Link from "next/link";
import { type Product, shortDesc } from "@/lib/products";
import { ArrowUpRight, Shield } from "./Icons";

const catColor: Record<string, string> = {
  Telecommunication: "text-teal bg-teal/10 ring-1 ring-teal/20",
  Railway: "text-grass bg-grass/10 ring-1 ring-grass/20",
  Defence: "text-lime bg-lime/10 ring-1 ring-lime/20",
};

export function ProductCard({ product }: { product: Product }) {
  const img = product.images[0];
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-base-800 transition-all duration-300 hover:-translate-y-1 hover:border-grass/40 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-base-700 to-base-800">
        <div className="glow-teal absolute inset-x-6 bottom-0 top-8 opacity-25" />
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={product.name}
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
          {product.category === "Defence" ? "Defence" : product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-white group-hover:text-grass">
          {product.name.replace(/\s+/g, " ").trim()}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-fog">
          {shortDesc(product.description)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          {product.warrantyMonths ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fog">
              <Shield className="h-4 w-4 text-grass" />
              {product.warrantyMonths}-mo warranty
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-grass">
            Details
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
