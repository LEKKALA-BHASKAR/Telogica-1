"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGetWithMeta, apiPatch, toApiError } from "@/lib/api";
import { formatDate, formatPrice, statusLabel } from "@/lib/format";
import type { PageMeta, Quote, QuoteStatus } from "@/lib/types";
import {
  ErrorNote,
  Loading,
  Pagination,
  StatusBadge,
  inputClass,
} from "@/components/commerce/Bits";

const STATUSES: QuoteStatus[] = ["new", "in_review", "quoted", "won", "lost"];

function QuoteCard({ quote, onChanged }: { quote: Quote; onChanged: () => void }) {
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [amount, setAmount] = useState(quote.quotedAmount ?? 0);
  const [notes, setNotes] = useState(quote.adminNotes ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await apiPatch(`/quotes/${quote._id}`, {
        status,
        quotedAmount: amount || undefined,
        adminNotes: notes,
      });
      // Setting "quoted" with an amount emails the customer automatically.
      toast.success(
        status === "quoted" && amount
          ? `Quote emailed to ${quote.email}`
          : `${quote.quoteNumber} updated`
      );
      onChanged();
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-2xl border border-line bg-base-900 p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-display text-base font-bold text-white">{quote.quoteNumber}</span>
            <StatusBadge status={quote.status} />
            <span className="text-xs text-fog-dim">{formatDate(quote.createdAt, true)}</span>
          </div>

          <p className="mt-3 text-sm text-white">
            {quote.name}
            {quote.company && <span className="text-fog"> · {quote.company}</span>}
          </p>
          <p className="text-sm text-fog">
            <a href={`mailto:${quote.email}`} className="hover:text-teal">
              {quote.email}
            </a>
            {quote.phone && ` · ${quote.phone}`}
          </p>

          {quote.items.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm text-fog">
              {quote.items.map((item, i) => (
                <li key={i}>
                  {item.name} <span className="text-fog-dim">× {item.qty}</span>
                </li>
              ))}
            </ul>
          )}

          {quote.message && (
            <p className="mt-4 whitespace-pre-line rounded-xl border border-line bg-base-800 px-4 py-3 text-sm text-fog">
              {quote.message}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-line bg-base-800 p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-fog">Respond</h4>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as QuoteStatus)}
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Quoted amount (₹)"
            className={inputClass}
          />

          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes sent to the customer…"
            className={inputClass}
          />

          <button
            onClick={save}
            disabled={busy}
            className="w-full rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
          >
            {status === "quoted" && amount ? "Save & email quote" : "Save"}
          </button>

          {quote.quotedAmount ? (
            <p className="text-center text-xs text-fog">
              Currently quoted at{" "}
              <span className="font-semibold text-white">{formatPrice(quote.quotedAmount)}</span>
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default function AdminQuotesPage() {
  const [items, setItems] = useState<Quote[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetWithMeta<{ items: Quote[] }>("/quotes/admin/all", {
        page,
        limit: 10,
      });
      setItems(res.data.items);
      setMeta(res.meta ?? null);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-white">Quote requests</h2>
      <p className="mt-1 text-sm text-fog">
        {meta ? `${meta.total} request${meta.total === 1 ? "" : "s"}` : "Loading…"}
      </p>

      {error && (
        <div className="mt-6">
          <ErrorNote message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : items.length ? (
        <>
          <ul className="mt-6 space-y-5">
            {items.map((quote) => (
              <QuoteCard key={quote._id} quote={quote} onChanged={load} />
            ))}
          </ul>
          {meta && <Pagination page={meta.page} pages={meta.pages} onChange={setPage} />}
        </>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-line py-16 text-center text-sm text-fog">
          No quote requests yet.
        </p>
      )}
    </div>
  );
}
