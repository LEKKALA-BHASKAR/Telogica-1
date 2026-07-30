"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGetWithMeta, apiPost, toApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { PageMeta, Review } from "@/lib/types";
import { useAuth } from "@/store/hooks";
import { ErrorNote, Field, Loading, StarRating, SubmitButton, inputClass } from "./Bits";
import { Check, Star } from "../Icons";

interface ReviewResponse {
  items: Review[];
  histogram: { star: number; count: number }[];
}

function RatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          className="p-0.5"
        >
          <Star
            className={`h-7 w-7 transition ${star <= shown ? "text-teal" : "text-line-strong"}`}
            fill={star <= shown ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  rating,
  numReviews,
}: {
  productId: string;
  rating: number;
  numReviews: number;
}) {
  const { user } = useAuth();
  const [data, setData] = useState<ReviewResponse | null>(null);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ rating: 0, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetWithMeta<ReviewResponse>(`/products/${productId}/reviews`, {
        limit: 10,
      });
      setData(res.data);
      setMeta(res.meta ?? null);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.rating < 1) {
      setError("Choose a star rating first");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiPost(`/products/${productId}/reviews`, form);
      toast.success("Thanks — your review is published");
      setForm({ rating: 0, title: "", comment: "" });
      await load();
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  }

  const total = meta?.total ?? numReviews;

  return (
    <section className="container-x border-t border-line/60 py-14">
      <h2 className="font-display text-2xl font-bold text-white">Customer reviews</h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[320px_1fr]">
        {/* Summary + form */}
        <div>
          <div className="rounded-2xl border border-line bg-base-900 p-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-white">
                {rating > 0 ? rating.toFixed(1) : "—"}
              </span>
              <span className="text-sm text-fog">out of 5</span>
            </div>
            <div className="mt-2">
              <StarRating value={rating} />
            </div>
            <p className="mt-2 text-sm text-fog">
              {total} review{total === 1 ? "" : "s"}
            </p>

            {data?.histogram && total > 0 && (
              <div className="mt-5 space-y-2">
                {data.histogram.map((row) => (
                  <div key={row.star} className="flex items-center gap-2 text-xs text-fog">
                    <span className="w-8">{row.star}★</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-base-700">
                      <span
                        className="block h-full rounded-full bg-brand-gradient"
                        style={{ width: `${total ? (row.count / total) * 100 : 0}%` }}
                      />
                    </span>
                    <span className="w-6 text-right">{row.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-line bg-base-900 p-6">
              <h3 className="font-display text-base font-semibold text-white">Write a review</h3>
              <div className="mt-4">
                <RatingPicker
                  value={form.rating}
                  onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                />
              </div>
              <Field label="Headline" htmlFor="review-title" className="mt-4">
                <input
                  id="review-title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Accurate and rugged"
                  maxLength={120}
                  className={inputClass}
                />
              </Field>
              <Field label="Your review" htmlFor="review-comment" className="mt-4">
                <textarea
                  id="review-comment"
                  required
                  rows={4}
                  minLength={4}
                  value={form.comment}
                  onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder="How did it perform in the field?"
                  className={inputClass}
                />
              </Field>
              {error && (
                <div className="mt-3">
                  <ErrorNote message={error} />
                </div>
              )}
              <SubmitButton loading={submitting} className="mt-4 w-full">
                Publish review
              </SubmitButton>
            </form>
          ) : (
            <p className="mt-6 rounded-2xl border border-line bg-base-900 p-6 text-sm text-fog">
              <a href="/login" className="font-semibold text-teal hover:text-teal-400">
                Sign in
              </a>{" "}
              to leave a review. Reviews from delivered orders carry a verified-purchase badge.
            </p>
          )}
        </div>

        {/* List */}
        <div>
          {loading ? (
            <Loading label="Loading reviews…" />
          ) : data && data.items.length ? (
            <ul className="space-y-5">
              {data.items.map((review) => (
                <li key={review._id} className="rounded-2xl border border-line bg-base-900 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-black">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{review.name}</p>
                        <p className="text-xs text-fog-dim">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <StarRating value={review.rating} size={14} />
                  </div>

                  {review.isVerifiedPurchase && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-grass/10 px-2.5 py-1 text-xs font-semibold text-grass ring-1 ring-grass/25">
                      <Check className="h-3 w-3" /> Verified purchase
                    </span>
                  )}

                  {review.title && (
                    <h4 className="mt-3 font-display text-base font-semibold text-white">
                      {review.title}
                    </h4>
                  )}
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fog">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center text-sm text-fog">
              No reviews yet — be the first to share how this instrument performed.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
