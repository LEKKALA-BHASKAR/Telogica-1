import Link from "next/link";
import type { ReactNode } from "react";
import { discountPercent, formatPrice, statusLabel, statusTone } from "@/lib/format";
import { ChevronLeft, ChevronRight, Spinner, Star } from "../Icons";

/* ── Price ─────────────────────────────────────────────────────────────── */

export function PriceTag({
  price,
  mrp,
  requiresQuote,
  size = "md",
}: {
  price: number;
  mrp?: number;
  requiresQuote?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  if (requiresQuote) {
    return (
      <span
        className={`font-semibold text-teal ${
          size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base"
        }`}
      >
        Price on request
      </span>
    );
  }

  const off = discountPercent(mrp ?? 0, price);
  const priceSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <span className="flex flex-wrap items-baseline gap-2">
      <span className={`font-display font-bold text-white ${priceSize}`}>{formatPrice(price)}</span>
      {off > 0 && (
        <>
          <span className="text-sm text-fog-dim line-through">{formatPrice(mrp ?? 0)}</span>
          <span className="rounded-full bg-grass/12 px-2 py-0.5 text-xs font-bold text-grass ring-1 ring-grass/25">
            {off}% off
          </span>
        </>
      )}
    </span>
  );
}

/* ── Rating ────────────────────────────────────────────────────────────── */

export function StarRating({
  value,
  count,
  size = 16,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            width={size}
            height={size}
            className={star <= Math.round(value) ? "text-teal" : "text-line-strong"}
            fill={star <= Math.round(value) ? "currentColor" : "none"}
          />
        ))}
      </span>
      {count !== undefined && (
        <span className="text-xs text-fog">
          {value > 0 ? value.toFixed(1) : "No reviews"}
          {count > 0 && ` (${count})`}
        </span>
      )}
    </span>
  );
}

/* ── Status pill ───────────────────────────────────────────────────────── */

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(
        status
      )}`}
    >
      {statusLabel(status)}
    </span>
  );
}

/* ── Layout helpers ────────────────────────────────────────────────────── */

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-base-900 p-6 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  intro,
  action,
  icon,
}: {
  title: string;
  intro?: string;
  action?: { label: string; href: string };
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-base-900/40 px-6 py-16 text-center">
      {icon && <div className="mx-auto mb-4 flex justify-center text-fog-dim">{icon}</div>}
      <h3 className="font-display text-lg font-bold text-white">{title}</h3>
      {intro && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fog">{intro}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-fog">
      <Spinner className="h-5 w-5 text-teal" />
      {label}
    </div>
  );
}

/** Catalogue placeholder that matches the real card's geometry, so the grid
 *  doesn't jump when results arrive. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-base-800">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-6 w-1/2 rounded" />
        <div className="skeleton h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {message}
    </p>
  );
}

/* ── Pagination ────────────────────────────────────────────────────────── */

export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;

  // Show a window around the current page rather than every page number.
  const window: number[] = [];
  const from = Math.max(1, page - 2);
  const to = Math.min(pages, from + 4);
  for (let i = Math.max(1, to - 4); i <= to; i++) window.push(i);

  const btn =
    "inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-semibold transition";

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`${btn} border-line bg-base-800 text-fog hover:text-white disabled:opacity-40`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {window[0] > 1 && <span className="px-1 text-fog-dim">…</span>}

      {window.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`${btn} ${
            p === page
              ? "border-teal bg-teal text-white"
              : "border-line bg-base-800 text-fog hover:text-white"
          }`}
        >
          {p}
        </button>
      ))}

      {window[window.length - 1] < pages && <span className="px-1 text-fog-dim">…</span>}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className={`${btn} border-line bg-base-800 text-fog hover:text-white disabled:opacity-40`}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/* ── Forms ─────────────────────────────────────────────────────────────── */

export const inputClass =
  "w-full rounded-xl border border-line bg-base-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-fog-dim focus:border-teal focus:ring-2 focus:ring-teal/25 disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-fog-bright">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-300">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-fog-dim">{hint}</p>
      ) : null}
    </div>
  );
}

export function SubmitButton({
  children,
  loading,
  disabled,
  className = "",
  type = "submit",
  onClick,
  form,
}: {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "button";
  onClick?: () => void;
  /** Lets a button outside the <form> submit it (sticky footers). */
  form?: string;
}) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-teal px-6 py-3 text-sm font-semibold text-white shadow-glow-teal transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
