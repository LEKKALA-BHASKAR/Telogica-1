"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGetWithMeta, apiPatch, toApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { AdminUser, PageMeta } from "@/lib/types";
import { useAuth } from "@/store/hooks";
import { ErrorNote, Loading, Pagination } from "@/components/commerce/Bits";
import { Search } from "@/components/Icons";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetWithMeta<{ items: AdminUser[] }>("/admin/users", {
        page,
        limit: 20,
        ...(debounced ? { q: debounced } : {}),
      });
      setItems(res.data.items);
      setMeta(res.meta ?? null);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page, debounced]);

  useEffect(() => {
    void load();
  }, [load]);

  async function update(id: string, patch: { role?: "user" | "admin"; isActive?: boolean }) {
    try {
      await apiPatch(`/admin/users/${id}`, patch);
      toast.success("Customer updated");
      await load();
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Customers</h2>
          <p className="mt-1 text-sm text-fog">
            {meta ? `${meta.total} account${meta.total === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, email or company…"
            className="w-64 rounded-full border border-line bg-base-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-teal"
          />
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-dim" />
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <ErrorNote message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-base-900">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-fog">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Company</th>
                  <th className="px-5 py-4 font-semibold">Joined</th>
                  <th className="px-5 py-4 font-semibold">Last seen</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 text-right font-semibold">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((user) => {
                  const isSelf = user._id === me?.id;
                  return (
                    <tr key={user._id} className="transition hover:bg-base-800/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-black">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-medium text-white">
                              {user.name}
                              {isSelf && <span className="ml-1.5 text-xs text-teal">(you)</span>}
                            </span>
                            <span className="block truncate text-xs text-fog-dim">
                              {user.email}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-fog">{user.company || "—"}</td>
                      <td className="px-5 py-4 text-fog">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-4 text-fog">
                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={user.role}
                          disabled={isSelf}
                          onChange={(e) =>
                            update(user._id, { role: e.target.value as "user" | "admin" })
                          }
                          className="rounded-lg border border-line bg-base-800 px-3 py-1.5 text-xs text-white outline-none focus:border-teal disabled:opacity-50"
                        >
                          <option value="user">Customer</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          disabled={isSelf}
                          onClick={() => update(user._id, { isActive: !user.isActive })}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition disabled:opacity-50 ${
                            user.isActive
                              ? "bg-grass/10 text-grass ring-grass/25 hover:bg-red-500/10 hover:text-red-300 hover:ring-red-500/25"
                              : "bg-red-500/10 text-red-300 ring-red-500/25 hover:bg-grass/10 hover:text-grass hover:ring-grass/25"
                          }`}
                        >
                          {user.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {meta && <Pagination page={meta.page} pages={meta.pages} onChange={setPage} />}
        </>
      )}
    </div>
  );
}
