"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api, apiPatch, apiPost, toApiError, type FieldError } from "@/lib/api";
import type { ApiProduct, Category } from "@/lib/types";
import { ErrorNote, Field, SubmitButton, inputClass } from "./Bits";
import { Plus, Spinner, Trash, X } from "../Icons";

const CATEGORIES: Category[] = ["Telecommunication", "Railway", "Defence"];

interface Draft {
  name: string;
  sku: string;
  category: Category;
  sectors: Category[];
  description: string;
  shortDescription: string;
  images: string[];
  features: string[];
  specs: { key: string; value: string }[];
  tags: string[];
  price: number;
  mrp: number;
  stock: number;
  warrantyMonths: number | null;
  requiresQuote: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

const EMPTY: Draft = {
  name: "",
  sku: "",
  category: "Telecommunication",
  sectors: ["Telecommunication"],
  description: "",
  shortDescription: "",
  images: [],
  features: [],
  specs: [],
  tags: [],
  price: 0,
  mrp: 0,
  stock: 0,
  warrantyMonths: 12,
  requiresQuote: false,
  isFeatured: false,
  isActive: true,
};

function toDraft(product: ApiProduct): Draft {
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    sectors: product.sectors,
    description: product.description,
    shortDescription: product.shortDescription ?? "",
    images: product.images ?? [],
    features: product.features ?? [],
    specs: product.specs ?? [],
    tags: product.tags ?? [],
    price: product.price,
    mrp: product.mrp,
    stock: product.stock,
    warrantyMonths: product.warrantyMonths,
    requiresQuote: product.requiresQuote,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
  };
}

/** Slide-over create/edit form for the admin catalogue. */
export function ProductEditor({
  product,
  onClose,
  onSaved,
}: {
  product: ApiProduct | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(product ? toDraft(product) : EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const errorFor = (field: string) => fieldErrors.find((e) => e.field === field)?.message;

  // Escape closes the panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function toggleSector(sector: Category) {
    const next = draft.sectors.includes(sector)
      ? draft.sectors.filter((s) => s !== sector)
      : [...draft.sectors, sector];
    if (next.length) set("sectors", next);
  }

  async function uploadFiles(files: FileList) {
    setUploading(true);
    try {
      const body = new FormData();
      Array.from(files).forEach((file) => body.append("images", file));
      const { data } = await api.post<{ data: { urls: string[] } }>("/products/uploads", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set("images", [...draft.images, ...data.data.urls]);
      toast.success(`${data.data.urls.length} image(s) uploaded`);
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors([]);

    // Quote-only lines carry no price or stock.
    const payload = {
      ...draft,
      price: draft.requiresQuote ? 0 : Number(draft.price),
      mrp: draft.requiresQuote ? 0 : Number(draft.mrp),
      stock: draft.requiresQuote ? 0 : Number(draft.stock),
      features: draft.features.filter(Boolean),
      tags: draft.tags.filter(Boolean),
      specs: draft.specs.filter((s) => s.key && s.value),
    };

    try {
      if (product) await apiPatch(`/products/${product._id}`, payload);
      else await apiPost("/products", payload);
      toast.success(product ? "Product updated" : "Product created");
      onSaved();
      onClose();
    } catch (err) {
      const failure = toApiError(err);
      setError(failure.message);
      setFieldErrors(failure.fieldErrors);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        aria-label="Close editor"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-line bg-base-900 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-base-900/95 px-6 py-4 backdrop-blur">
          <h2 className="font-display text-lg font-bold text-white">
            {product ? "Edit product" : "New product"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-fog transition hover:bg-base-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form id="product-editor-form" onSubmit={onSubmit} className="flex-1 space-y-5 p-6">
          {error && <ErrorNote message={error} />}

          <Field label="Product name" htmlFor="p-name" error={errorFor("name")}>
            <input
              id="p-name"
              required
              minLength={3}
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SKU" htmlFor="p-sku" error={errorFor("sku")}>
              <input
                id="p-sku"
                required
                value={draft.sku}
                onChange={(e) => set("sku", e.target.value.toUpperCase())}
                placeholder="TLG-OTDR-321J"
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field label="Primary category" htmlFor="p-category">
              <select
                id="p-category"
                value={draft.category}
                onChange={(e) => set("category", e.target.value as Category)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Sectors served" error={errorFor("sectors")}>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((sector) => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => toggleSector(sector)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    draft.sectors.includes(sector)
                      ? "bg-teal text-white"
                      : "border border-line bg-base-800 text-fog hover:text-white"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="Short description"
            htmlFor="p-short"
            hint="Shown on catalogue cards. Max 400 characters."
          >
            <textarea
              id="p-short"
              rows={2}
              maxLength={400}
              value={draft.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Full description" htmlFor="p-desc" error={errorFor("description")}>
            <textarea
              id="p-desc"
              required
              rows={6}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass}
            />
          </Field>

          {/* Commercials */}
          <div className="rounded-2xl border border-line bg-base-800 p-5">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-white">
              <input
                type="checkbox"
                checked={draft.requiresQuote}
                onChange={(e) => set("requiresQuote", e.target.checked)}
                className="h-4 w-4 rounded border-line bg-base-900 accent-teal"
              />
              Quote-only — hide the price and keep this out of the cart
            </label>

            {!draft.requiresQuote && (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Field label="Selling price (₹)" htmlFor="p-price" error={errorFor("price")}>
                  <input
                    id="p-price"
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={draft.price}
                    onChange={(e) => set("price", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
                <Field label="MRP (₹)" htmlFor="p-mrp" error={errorFor("mrp")}>
                  <input
                    id="p-mrp"
                    type="number"
                    min={0}
                    step={1}
                    value={draft.mrp}
                    onChange={(e) => set("mrp", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Stock" htmlFor="p-stock" error={errorFor("stock")}>
                  <input
                    id="p-stock"
                    type="number"
                    min={0}
                    step={1}
                    value={draft.stock}
                    onChange={(e) => set("stock", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Warranty (months)" htmlFor="p-warranty" hint="Leave blank if none.">
              <input
                id="p-warranty"
                type="number"
                min={0}
                max={240}
                value={draft.warrantyMonths ?? ""}
                onChange={(e) =>
                  set("warrantyMonths", e.target.value === "" ? null : Number(e.target.value))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Search tags" htmlFor="p-tags" hint="Comma separated.">
              <input
                id="p-tags"
                value={draft.tags.join(", ")}
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value.split(",").map((t) => t.trim())
                  )
                }
                placeholder="otdr, fiber, testing"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Images */}
          <Field label="Images">
            <div className="flex flex-wrap gap-3">
              {draft.images.map((url, i) => (
                <div
                  key={url + i}
                  className="group relative h-24 w-24 overflow-hidden rounded-xl border border-line bg-base-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-contain p-2" />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "images",
                        draft.images.filter((_, index) => index !== i)
                      )
                    }
                    aria-label="Remove image"
                    className="absolute right-1 top-1 rounded-md bg-black/70 p-1 text-fog opacity-0 transition group-hover:opacity-100 hover:text-red-300"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-fog transition hover:border-teal/50 hover:text-white disabled:opacity-50"
              >
                {uploading ? <Spinner className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                <span className="text-[10px]">{uploading ? "Uploading" : "Upload"}</span>
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => e.target.files?.length && uploadFiles(e.target.files)}
            />
          </Field>

          {/* Features */}
          <Field label="Key features">
            <div className="space-y-2">
              {draft.features.map((feature, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={feature}
                    onChange={(e) =>
                      set(
                        "features",
                        draft.features.map((f, index) => (index === i ? e.target.value : f))
                      )
                    }
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "features",
                        draft.features.filter((_, index) => index !== i)
                      )
                    }
                    aria-label="Remove feature"
                    className="shrink-0 rounded-lg px-3 text-fog transition hover:text-red-300"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("features", [...draft.features, ""])}
                className="rounded-md border border-dashed border-line px-4 py-2 text-sm font-semibold text-fog transition hover:border-teal/50 hover:text-white"
              >
                + Add feature
              </button>
            </div>
          </Field>

          {/* Specs */}
          <Field label="Specifications">
            <div className="space-y-2">
              {draft.specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={spec.key}
                    placeholder="Frequency range"
                    onChange={(e) =>
                      set(
                        "specs",
                        draft.specs.map((s, index) =>
                          index === i ? { ...s, key: e.target.value } : s
                        )
                      )
                    }
                    className={`${inputClass} w-2/5`}
                  />
                  <input
                    value={spec.value}
                    placeholder="100 MHz – 40 GHz"
                    onChange={(e) =>
                      set(
                        "specs",
                        draft.specs.map((s, index) =>
                          index === i ? { ...s, value: e.target.value } : s
                        )
                      )
                    }
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "specs",
                        draft.specs.filter((_, index) => index !== i)
                      )
                    }
                    aria-label="Remove specification"
                    className="shrink-0 rounded-lg px-3 text-fog transition hover:text-red-300"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("specs", [...draft.specs, { key: "", value: "" }])}
                className="rounded-md border border-dashed border-line px-4 py-2 text-sm font-semibold text-fog transition hover:border-teal/50 hover:text-white"
              >
                + Add specification
              </button>
            </div>
          </Field>

          {/* Flags */}
          <div className="flex flex-wrap gap-6 rounded-2xl border border-line bg-base-800 p-5">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white">
              <input
                type="checkbox"
                checked={draft.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)}
                className="h-4 w-4 rounded border-line bg-base-900 accent-teal"
              />
              Featured
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-line bg-base-900 accent-teal"
              />
              Visible on the storefront
            </label>
          </div>
        </form>

        <div className="sticky bottom-0 flex gap-3 border-t border-line bg-base-900/95 px-6 py-4 backdrop-blur">
          <SubmitButton type="submit" form="product-editor-form" loading={saving}>
            {product ? "Save changes" : "Create product"}
          </SubmitButton>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-line bg-base-800 px-6 py-3 text-sm font-semibold text-fog transition hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
