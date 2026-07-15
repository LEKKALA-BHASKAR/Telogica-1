"use client";

import { useMemo, useState } from "react";
import { bse, filingGroups, groupOf } from "@/lib/bse";
import { FileText, ArrowUpRight } from "./Icons";

const TABS = ["All", ...filingGroups.map((g) => g.label)];

function fmtDate(d: string) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function InvestorDisclosures() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(15);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: bse.announcements.length };
    for (const g of filingGroups)
      c[g.label] = bse.announcements.filter((a) => groupOf(a.category) === g.label).length;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bse.announcements.filter((a) => {
      if (active !== "All" && groupOf(a.category) !== active) return false;
      if (q && !a.headline.toLowerCase().includes(q) && !a.subcategory.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [active, query]);

  const shown = filtered.slice(0, limit);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setActive(t);
              setLimit(15);
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              active === t
                ? "bg-teal text-white shadow-glow-teal"
                : "border border-line bg-base-800 text-fog hover:border-teal/50 hover:text-white"
            }`}
          >
            {t}
            <span className={`rounded-full px-1.5 text-xs ${active === t ? "bg-white/25" : "bg-base-600 text-fog-dim"}`}>
              {counts[t] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mt-5 w-full sm:max-w-sm">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(15);
          }}
          placeholder="Search filings…"
          className="w-full rounded-full border border-line bg-base-900 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-fog-dim focus:border-teal focus:ring-2 focus:ring-teal/25"
        />
        <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>

      <p className="mt-5 text-sm text-fog">
        {filtered.length} filing{filtered.length === 1 ? "" : "s"}
        <span className="ml-2 text-fog-dim">· sourced from BSE, scrip {bse.scrip}</span>
      </p>

      {/* List */}
      <div className="mt-4 divide-y divide-line/60 overflow-hidden rounded-2xl border border-line">
        {shown.map((a, i) => (
          <a
            key={i}
            href={a.pdf || bse.quote.bseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 bg-base-800 px-5 py-4 transition-colors hover:bg-base-700"
          >
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-teal/25 bg-teal/10 text-teal">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal">
                  {groupOf(a.category)}
                </span>
                <span className="text-xs text-fog-dim">{fmtDate(a.date)}</span>
                {a.sizeKb ? <span className="text-xs text-fog-dim">· {a.sizeKb} KB</span> : null}
              </span>
              <span className="mt-1 block truncate text-sm font-medium text-fog-bright group-hover:text-white">
                {a.headline || a.subcategory || "Disclosure"}
              </span>
            </span>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-fog-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal" />
          </a>
        ))}
        {!shown.length && (
          <div className="bg-base-800 px-5 py-10 text-center text-sm text-fog">No filings match your search.</div>
        )}
      </div>

      {limit < filtered.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setLimit((l) => l + 20)}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-base-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-teal/50"
          >
            Show more ({filtered.length - limit} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
