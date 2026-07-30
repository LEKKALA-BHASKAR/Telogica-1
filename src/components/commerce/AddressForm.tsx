"use client";

import { useState } from "react";
import type { Address } from "@/lib/types";
import { Field, SubmitButton, inputClass } from "./Bits";

const EMPTY: Address = {
  label: "Office",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

/** Shared by checkout and the account address book. */
export function AddressForm({
  initial,
  submitLabel = "Save address",
  saving,
  onSubmit,
  onCancel,
}: {
  initial?: Address | null;
  submitLabel?: string;
  saving?: boolean;
  onSubmit: (address: Address) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Address>({ ...EMPTY, ...(initial ?? {}) });

  const set = (key: keyof Address, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="fullName">
          <input
            id="fullName"
            required
            minLength={2}
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            required
            autoComplete="tel"
            inputMode="tel"
            // Parens must be escaped: browsers parse `pattern` with the `v` flag,
            // which rejects bare ( ) inside a character class.
            pattern="[0-9+\-\s\(\)]+"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 90000 00000"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Address line 1" htmlFor="line1">
        <input
          id="line1"
          required
          minLength={3}
          autoComplete="address-line1"
          value={form.line1}
          onChange={(e) => set("line1", e.target.value)}
          placeholder="Building, street"
          className={inputClass}
        />
      </Field>

      <Field label="Address line 2" htmlFor="line2" hint="Optional">
        <input
          id="line2"
          autoComplete="address-line2"
          value={form.line2 ?? ""}
          onChange={(e) => set("line2", e.target.value)}
          placeholder="Area, landmark"
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" htmlFor="city">
          <input
            id="city"
            required
            autoComplete="address-level2"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="State" htmlFor="state">
          <input
            id="state"
            required
            autoComplete="address-level1"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="PIN code" htmlFor="postalCode">
          <input
            id="postalCode"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            value={form.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Country" htmlFor="country">
          <input
            id="country"
            required
            autoComplete="country-name"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Label" htmlFor="label" hint="Home, Office, Site…">
          <input
            id="label"
            value={form.label ?? ""}
            onChange={(e) => set("label", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fog">
        <input
          type="checkbox"
          checked={Boolean(form.isDefault)}
          onChange={(e) => set("isDefault", e.target.checked)}
          className="h-4 w-4 rounded border-line bg-base-800 accent-teal"
        />
        Make this my default delivery address
      </label>

      <div className="flex flex-wrap gap-3 pt-2">
        <SubmitButton loading={saving}>{submitLabel}</SubmitButton>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-line bg-base-800 px-6 py-3 text-sm font-semibold text-fog transition hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function AddressCard({
  address,
  selected,
  onSelect,
  actions,
}: {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  actions?: React.ReactNode;
}) {
  const Wrapper = onSelect ? "button" : "div";
  return (
    <Wrapper
      {...(onSelect ? { type: "button" as const, onClick: onSelect } : {})}
      className={`w-full rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-teal bg-teal/5 ring-1 ring-teal/30"
          : "border-line bg-base-900 hover:border-line-strong"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            {address.fullName}
            {address.label && (
              <span className="rounded-full bg-base-700 px-2 py-0.5 text-[11px] font-medium text-fog">
                {address.label}
              </span>
            )}
            {address.isDefault && (
              <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-semibold text-teal ring-1 ring-teal/25">
                Default
              </span>
            )}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-fog">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
          </p>
          <p className="mt-2 text-sm text-fog-dim">{address.phone}</p>
        </div>
        {actions}
      </div>
    </Wrapper>
  );
}
