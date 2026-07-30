"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGetWithMeta, apiPatch, toApiError } from "@/lib/api";
import { formatDate, statusLabel } from "@/lib/format";
import type { ContactMessage, PageMeta } from "@/lib/types";
import { ErrorNote, Loading, Pagination, StatusBadge } from "@/components/commerce/Bits";
import { Inbox } from "@/components/Icons";

const STATUSES = ["new", "read", "replied", "archived"] as const;

export default function AdminMessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetWithMeta<{ items: ContactMessage[] }>("/messages/admin/all", {
        page,
        limit: 15,
        ...(filter ? { status: filter } : {}),
      });
      setItems(res.data.items);
      setMeta(res.meta ?? null);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    try {
      await apiPatch(`/messages/${id}`, { status });
      toast.success(`Marked ${statusLabel(status).toLowerCase()}`);
      await load();
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Contact messages</h2>
          <p className="mt-1 text-sm text-fog">
            {meta ? `${meta.total} message${meta.total === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-full border border-line bg-base-800 px-4 py-2.5 text-sm text-white outline-none focus:border-teal"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-6">
          <ErrorNote message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : items.length ? (
        <>
          <ul className="mt-6 space-y-4">
            {items.map((message) => (
              <li key={message._id} className="rounded-2xl border border-line bg-base-900 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex flex-wrap items-center gap-2.5">
                      <span className="font-display text-base font-bold text-white">
                        {message.subject}
                      </span>
                      <StatusBadge status={message.status} />
                    </p>
                    <p className="mt-1.5 text-sm text-fog">
                      {message.name} ·{" "}
                      <a href={`mailto:${message.email}`} className="hover:text-teal">
                        {message.email}
                      </a>
                      {message.phone && ` · ${message.phone}`}
                    </p>
                    <p className="mt-0.5 text-xs text-fog-dim">
                      {formatDate(message.createdAt, true)}
                      {message.productRef && ` · re: ${message.productRef}`}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {message.status !== "replied" && (
                      <button
                        onClick={() => setStatus(message._id, "replied")}
                        className="rounded-md bg-teal px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-600"
                      >
                        Mark replied
                      </button>
                    )}
                    {message.status === "new" && (
                      <button
                        onClick={() => setStatus(message._id, "read")}
                        className="rounded-md border border-line bg-base-800 px-3 py-2 text-xs font-semibold text-fog transition hover:text-white"
                      >
                        Mark read
                      </button>
                    )}
                    {message.status !== "archived" && (
                      <button
                        onClick={() => setStatus(message._id, "archived")}
                        className="rounded-md border border-line bg-base-800 px-3 py-2 text-xs font-semibold text-fog transition hover:text-white"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-line border-t border-line pt-4 text-sm leading-relaxed text-fog">
                  {message.message}
                </p>

                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                  className="mt-4 inline-block text-sm font-semibold text-teal hover:text-teal-400"
                >
                  Reply by email →
                </a>
              </li>
            ))}
          </ul>
          {meta && <Pagination page={meta.page} pages={meta.pages} onChange={setPage} />}
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-fog-dim" />
          <p className="mt-3 text-sm text-fog">No messages here.</p>
        </div>
      )}
    </div>
  );
}
