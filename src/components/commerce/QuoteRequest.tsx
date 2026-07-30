"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet, apiPost, toApiError } from "@/lib/api";
import { cleanName } from "@/lib/format";
import { site } from "@/lib/site";
import type { ApiProduct, Quote } from "@/lib/types";
import { useAuth } from "@/store/hooks";
import { ErrorNote, Field, SubmitButton, inputClass } from "./Bits";
import { QtyStepper } from "./AddToCart";
import { Check, Mail, Phone } from "../Icons";

/**
 * Request-for-quote intake. Reachable from any quote-only product, and works
 * signed out — a purchase order shouldn't require an account first.
 */
export function QuoteRequest() {
  const params = useSearchParams();
  const productId = params.get("product");
  const { user } = useAuth();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Quote | null>(null);

  // Pre-fill from the signed-in account.
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name,
      email: f.email || user.email,
      phone: f.phone || user.phone,
      company: f.company || user.company,
    }));
  }, [user]);

  useEffect(() => {
    if (!productId) return;
    apiGet<{ product: ApiProduct }>(`/products/${productId}`)
      .then((data) => setProduct(data.product))
      .catch(() => setProduct(null));
  }, [productId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { quote } = await apiPost<{ quote: Quote }>("/quotes", {
        ...form,
        items: product ? [{ productId: product._id, qty }] : [],
      });
      setDone(quote);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="container-x py-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-line bg-base-900 p-10 text-center shadow-card">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-black">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">Request received</h1>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            Your reference is{" "}
            <span className="font-mono font-semibold text-teal">{done.quoteNumber}</span>. Our
            application engineers will respond within one business day.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href={user ? "/account/quotes" : "/products"}
              className="rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              {user ? "Track my quotes" : "Browse products"}
            </Link>
            <Link
              href="/"
              className="rounded-md border border-line bg-base-800 px-5 py-2.5 text-sm font-semibold text-fog transition hover:text-white"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <span className="eyebrow">Request for quotation</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Tell us what you need
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-fog">
          Defence RF lines, bespoke monitoring systems and volume orders are priced to
          specification. Send us the requirement and our engineers respond within one business day.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-base-900 p-6 sm:p-8">
            {error && (
              <div className="mb-5">
                <ErrorNote message={error} />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" htmlFor="name">
                <input
                  id="name"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Work email" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 90000 00000"
                  className={inputClass}
                />
              </Field>
              <Field label="Organisation" htmlFor="company">
                <input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Requirement"
              htmlFor="message"
              className="mt-4"
              hint="Frequency range, output power, form factor, quantity, delivery timeline — whatever you have."
            >
              <textarea
                id="message"
                rows={6}
                maxLength={4000}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="We need a 2–18 GHz benchtop amplifier, 50 W minimum, for an EW test bench…"
                className={inputClass}
              />
            </Field>

            <SubmitButton loading={busy} className="mt-6">
              Send request
            </SubmitButton>
          </form>

          <aside className="space-y-6">
            {product && (
              <div className="rounded-2xl border border-line bg-base-900 p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-fog">
                  Quoting for
                </h2>
                <div className="mt-4 flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-base-800">
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={cleanName(product.name)}
                        className="h-full w-full object-contain p-1.5"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="line-clamp-3 text-sm font-medium text-white hover:text-teal"
                    >
                      {cleanName(product.name)}
                    </Link>
                    <p className="mt-1 text-xs text-fog-dim">SKU {product.sku}</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-fog">Quantity</span>
                  <QtyStepper value={qty} max={999} onChange={setQty} />
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-line bg-base-900 p-6 text-sm text-fog">
              <h2 className="font-display text-base font-bold text-white">Prefer to talk?</h2>
              <a
                href={`mailto:${site.email.sales}`}
                className="mt-4 flex items-center gap-2.5 hover:text-white"
              >
                <Mail className="h-4 w-4 text-teal" /> {site.email.sales}
              </a>
              <a
                href={`tel:${site.phones[0].replace(/\s/g, "")}`}
                className="mt-2.5 flex items-center gap-2.5 hover:text-white"
              >
                <Phone className="h-4 w-4 text-teal" /> {site.phones[0]}
              </a>
              <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-fog-dim">
                {site.hours}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
