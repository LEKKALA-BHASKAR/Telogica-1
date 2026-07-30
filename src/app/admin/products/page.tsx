"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiDelete, apiGetWithMeta, toApiError } from "@/lib/api";
import { cleanName, formatPrice } from "@/lib/format";
import type { ApiProduct, PageMeta } from "@/lib/types";
import { ErrorNote, Loading, Pagination } from "@/components/commerce/Bits";
import { ProductEditor } from "@/components/commerce/ProductEditor";
import { Pencil, Plus, Search, Trash } from "@/components/Icons";

export default function AdminProductsPage() {
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [creating, setCreating] = useState(false);

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
      const res = await apiGetWithMeta<{ items: ApiProduct[] }>("/products/admin/all", {
        page,
        limit: 20,
        sort: "newest",
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

  async function archive(product: ApiProduct) {
    const label = product.isActive ? "Archive" : "Permanently delete";
    if (!window.confirm(`${label} "${cleanName(product.name)}"?`)) return;
    try {
      // Active products are archived so order history keeps resolving;
      // an already-archived product can be removed for good.
      await apiDelete(`/products/${product._id}`, product.isActive ? undefined : { hard: true });
      toast.success(product.isActive ? "Product archived" : "Product deleted");
      await load();
    } catch (err) {
      toast.error(toApiError(err).message);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Catalogue</h2>
          <p className="mt-1 text-sm text-fog">
            {meta ? `${meta.total} product${meta.total === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or SKU…"
              className="w-56 rounded-full border border-line bg-base-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-teal"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-dim" />
          </div>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" /> New product
          </button>
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
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-fog">
                <tr>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">SKU</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 text-right font-semibold">Price</th>
                  <th className="px-5 py-4 text-right font-semibold">Stock</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((product) => (
                  <tr key={product._id} className="transition hover:bg-base-800/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-base-800">
                          {product.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt=""
                              className="h-full w-full object-contain p-1"
                            />
                          )}
                        </span>
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="line-clamp-2 max-w-[280px] font-medium text-white hover:text-teal"
                        >
                          {cleanName(product.name)}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-fog">{product.sku}</td>
                    <td className="px-5 py-4 text-fog">{product.category}</td>
                    <td className="px-5 py-4 text-right font-medium text-white">
                      {product.requiresQuote ? (
                        <span className="text-xs text-teal">On request</span>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {product.requiresQuote ? (
                        <span className="text-fog-dim">—</span>
                      ) : (
                        <span
                          className={
                            product.stock === 0
                              ? "font-semibold text-red-300"
                              : product.stock <= 5
                                ? "font-semibold text-amber-300"
                                : "text-white"
                          }
                        >
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex flex-wrap gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
                            product.isActive
                              ? "bg-grass/10 text-grass ring-grass/25"
                              : "bg-fog/10 text-fog ring-fog/25"
                          }`}
                        >
                          {product.isActive ? "Live" : "Archived"}
                        </span>
                        {product.isFeatured && (
                          <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-semibold text-teal ring-1 ring-teal/25">
                            Featured
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditing(product)}
                          aria-label={`Edit ${product.name}`}
                          className="rounded-lg p-2 text-fog transition hover:bg-base-700 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => archive(product)}
                          aria-label={`Remove ${product.name}`}
                          className="rounded-lg p-2 text-fog transition hover:bg-base-700 hover:text-red-300"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && <Pagination page={meta.page} pages={meta.pages} onChange={setPage} />}
        </>
      )}

      {(editing || creating) && (
        <ProductEditor
          product={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={load}
        />
      )}
    </div>
  );
}
