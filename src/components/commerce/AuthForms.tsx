"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { apiPost, toApiError } from "@/lib/api";
import { clearAuthError, login, register } from "@/store/authSlice";
import { useAppDispatch, useAuth } from "@/store/hooks";
import { ErrorNote, Field, SubmitButton, inputClass } from "./Bits";
import { Check, Lock } from "../Icons";

function AuthShell({
  eyebrow,
  title,
  intro,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="vignette absolute inset-0" />
      <div className="bg-dots absolute inset-0 opacity-30" />
      <div className="container-x relative flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-fog">{intro}</p>

          <div className="mt-8 rounded-2xl border border-line bg-base-900 p-6 shadow-card sm:p-8">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-fog">{footer}</div>}
        </div>
      </div>
    </section>
  );
}

/** Where to land after signing in — honours ?next= but only for internal paths. */
function useNextPath() {
  const params = useSearchParams();
  const next = params.get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account/orders";
}

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const nextPath = useNextPath();
  const { submitting, error, user, status } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Already signed in — don't show the form again.
  useEffect(() => {
    if (status === "ready" && user) router.replace(nextPath);
  }, [status, user, router, nextPath]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name.split(" ")[0]}`);
      router.push(result.payload.role === "admin" ? "/admin" : nextPath);
    }
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Sign in"
      intro="Track orders, manage quote requests and check out faster."
      footer={
        <>
          New to Telogica?{" "}
          <Link href="/register" className="font-semibold text-teal hover:text-teal-400">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorNote message={error} />}

        <Field label="Email address" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            className={inputClass}
          />
        </Field>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs font-medium text-fog hover:text-teal">
            Forgot your password?
          </Link>
        </div>

        <SubmitButton loading={submitting} className="w-full">
          <Lock className="h-4 w-4" /> Sign in
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const nextPath = useNextPath();
  const { submitting, error, user, status } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (status === "ready" && user) router.replace(nextPath);
  }, [status, user, router, nextPath]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success("Account created — welcome to Telogica");
      router.push(nextPath);
    }
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Create your account"
      intro="One account for orders, quote requests and delivery tracking."
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-teal hover:text-teal-400">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorNote message={error} />}

        <Field label="Full name" htmlFor="name">
          <input
            id="name"
            required
            minLength={2}
            autoComplete="name"
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
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" htmlFor="phone">
            <input
              id="phone"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+91 90000 00000"
              className={inputClass}
            />
          </Field>
          <Field label="Company" htmlFor="company">
            <input
              id="company"
              autoComplete="organization"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Password"
          htmlFor="password"
          hint="At least 8 characters, including a letter and a number."
        >
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className={inputClass}
          />
        </Field>

        <SubmitButton loading={submitting} className="w-full">
          Create account
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await apiPost("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Reset your password"
      intro="We'll email you a link to choose a new one."
      footer={
        <Link href="/login" className="font-semibold text-teal hover:text-teal-400">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-black">
            <Check className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm leading-relaxed text-fog">
            If <span className="font-semibold text-white">{email}</span> is registered, a reset link
            is on its way. It expires in 30 minutes.
          </p>
          <p className="mt-3 text-xs text-fog-dim">
            No SMTP configured in development? The link is printed in the API server console.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <ErrorNote message={error} />}
          <Field label="Email address" htmlFor="email">
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>
          <SubmitButton loading={busy} className="w-full">
            Email me a reset link
          </SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await apiPost("/auth/reset-password", { token, password });
      toast.success("Password updated — you're signed in");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Choose a new password"
      intro="Pick something you haven't used before."
      footer={
        <Link href="/login" className="font-semibold text-teal hover:text-teal-400">
          Back to sign in
        </Link>
      }
    >
      {!token ? (
        <ErrorNote message="That reset link is missing its token. Request a new one from the forgot-password page." />
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <ErrorNote message={error} />}
          <Field
            label="New password"
            htmlFor="password"
            hint="At least 8 characters, including a letter and a number."
          >
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <SubmitButton loading={busy} className="w-full">
            Update password
          </SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
