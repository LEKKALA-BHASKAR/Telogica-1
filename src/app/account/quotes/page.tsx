"use client";

import { useEffect, useState } from "react";
import { apiGet, toApiError } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import type { Quote } from "@/lib/types";
import { EmptyState, ErrorNote, Loading, StatusBadge } from "@/components/commerce/Bits";
import { FileText } from "@/components/Icons";

export default function MyQuotesPage() {
  const [items, setItems] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ items: Quote[] }>("/quotes/mine")
      .then((data) => setItems(data.items))
      .catch((err) => setError(toApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-white">Quote requests</h2>
      <p className="mt-1 text-sm text-fog">
        Pricing enquiries for defence RF, bespoke systems and volume orders.
      </p>

      {error && (
        <div className="mt-6">
          <ErrorNote message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : items.length ? (
        <ul className="mt-6 space-y-4">
          {items.map((quote) => (
            <li key={quote._id} className="rounded-2xl border border-line bg-base-900 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display text-base font-bold text-white">
                      {quote.quoteNumber}
                    </span>
                    <StatusBadge status={quote.status} />
                  </p>
                  <p className="mt-1.5 text-sm text-fog">Raised {formatDate(quote.createdAt)}</p>
                </div>
                {quote.quotedAmount ? (
                  <div className="text-right">
                    <p className="text-xs text-fog">Quoted</p>
                    <p className="font-display text-lg font-bold text-white">
                      {formatPrice(quote.quotedAmount)}
                    </p>
                  </div>
                ) : null}
              </div>

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
                <p className="mt-3 whitespace-pre-line text-sm text-fog-dim">{quote.message}</p>
              )}

              {quote.adminNotes && (
                <p className="mt-4 rounded-xl border border-teal/25 bg-teal/5 px-4 py-3 text-sm text-fog-bright">
                  <span className="font-semibold text-teal">Telogica: </span>
                  {quote.adminNotes}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={<FileText className="h-10 w-10" />}
            title="No quote requests yet"
            intro="Request pricing on defence RF lines, bespoke systems or volume orders and they'll appear here."
            action={{ label: "Request a quote", href: "/quote" }}
          />
        </div>
      )}
    </div>
  );
}
