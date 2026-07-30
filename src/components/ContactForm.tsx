"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiPost, toApiError } from "@/lib/api";
import { ErrorNote } from "./commerce/Bits";
import { ArrowRight, Check, Spinner } from "./Icons";

const subjects = ["Sales Inquiry", "Technical Support", "Request a Quote", "Partnership", "Careers", "Other"];

export function ContactForm() {
  const params = useSearchParams();
  const product = params.get("product");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: product ? "Request a Quote" : "Sales Inquiry",
    message: product ? `I'd like a quote for: ${product}\n\n` : "",
  });

  useEffect(() => {
    if (product) {
      setForm((f) => ({
        ...f,
        subject: "Request a Quote",
        message: f.message || `I'd like a quote for: ${product}\n\n`,
      }));
    }
  }, [product]);

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Persisted to MongoDB and surfaced in Admin → Messages.
      await apiPost("/messages", { ...form, productRef: product ?? undefined });
      setSent(true);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-line bg-base-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-fog-dim focus:border-teal focus:ring-2 focus:ring-teal/25";

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-base-800 p-10 text-center shadow-card">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-black">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-white">Thank you!</h3>
        <p className="mt-2 max-w-sm text-sm text-fog">
          Your message has reached our sales desk and a confirmation is on its way to your inbox.
          We respond within 24 hours.
        </p>
        <button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-teal">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-base-800 p-6 shadow-card sm:p-8">
      <h3 className="font-display text-xl font-bold text-white">Send us a message</h3>
      <p className="mt-1 text-sm text-fog">We&rsquo;ll respond within 24 hours.</p>

      {error && (
        <div className="mt-5">
          <ErrorNote message={error} />
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-fog-bright">Full Name *</label>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} className={field} placeholder="Your name" />
        </div>
        <div className="sm:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-fog-bright">Email Address *</label>
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={field} placeholder="you@company.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fog-bright">Phone Number</label>
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={field} placeholder="+91…" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-fog-bright">Subject *</label>
          <select required value={form.subject} onChange={(e) => update("subject", e.target.value)} className={field}>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-fog-bright">Message *</label>
          <textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${field} resize-none`} placeholder="How can we help?" />
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal px-6 py-3.5 text-sm font-semibold text-white shadow-glow-teal transition-all hover:-translate-y-0.5 hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {busy ? <Spinner className="h-4 w-4" /> : null}
        {busy ? "Sending…" : "Send Message"}
        {!busy && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </button>
      <p className="mt-3 text-xs text-fog-dim">
        By submitting this form, you agree to our{" "}
        <a href="/privacy-policy" className="underline hover:text-white">Privacy Policy</a>.
      </p>
    </form>
  );
}
