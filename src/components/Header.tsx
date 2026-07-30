"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Logo } from "./Brand";
import { accountNav, adminNav, nav } from "@/lib/site";
import { cartCount } from "@/lib/commerce";
import { logout } from "@/store/authSlice";
import { resetToGuest } from "@/store/cartSlice";
import { useAppDispatch, useAuth, useCart } from "@/store/hooks";
import { ArrowRight, Cart, ChevronDown, Dashboard, LogOut, Menu, User, X } from "./Icons";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, status } = useAuth();
  const { items } = useCart();

  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Close the account dropdown on an outside click or Escape.
  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function onSignOut() {
    await dispatch(logout());
    dispatch(resetToGuest());
    toast.success("Signed out");
    router.push("/");
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/70 bg-black/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-white" : "text-fog hover:text-white"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-brand-gradient" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={`Cart — ${count} item${count === 1 ? "" : "s"}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-base-700"
          >
            <Cart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-teal px-1 text-[11px] font-bold text-black">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {/* Account */}
          <div ref={accountRef} className="relative hidden lg:block">
            {status !== "ready" ? (
              <div className="h-10 w-24 animate-pulse rounded-full bg-base-700" />
            ) : user ? (
              <>
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-base-800 py-1.5 pl-1.5 pr-3 text-sm font-medium text-white transition hover:border-teal/50"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-black">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-fog transition-transform ${accountOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-base-900 shadow-card">
                    <div className="border-b border-line px-4 py-3">
                      <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                      <p className="truncate text-xs text-fog">{user.email}</p>
                    </div>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 border-b border-line px-4 py-3 text-sm font-semibold text-teal hover:bg-base-800"
                      >
                        <Dashboard className="h-4 w-4" /> Admin panel
                      </Link>
                    )}

                    <div className="py-1">
                      {accountNav.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-fog-bright hover:bg-base-800 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    <button
                      onClick={onSignOut}
                      className="flex w-full items-center gap-2.5 border-t border-line px-4 py-3 text-left text-sm text-fog hover:bg-base-800 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-base-800 px-4 py-2 text-sm font-medium text-white transition hover:border-teal/50"
              >
                <User className="h-4 w-4" /> Sign in
              </Link>
            )}
          </div>

          <Link
            href="/contact"
            className="group hidden items-center gap-2 rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-600 lg:inline-flex"
          >
            Request a Quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-line bg-black lg:hidden ${
          open ? "max-h-[720px]" : "max-h-0"
        } transition-[max-height] duration-300`}
      >
        <nav className="container-x flex flex-col gap-1 py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-3 text-base font-medium ${
                isActive(item.href) ? "bg-base-700 text-white" : "text-fog"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="my-2 h-px bg-line" />

          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="rounded-xl px-4 py-3 text-base font-semibold text-teal">
                  Admin panel
                </Link>
              )}
              {accountNav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-base text-fog">
                  {item.label}
                </Link>
              ))}
              <button onClick={onSignOut} className="rounded-xl px-4 py-3 text-left text-base text-fog">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-4 py-3 text-base text-fog">
                Sign in
              </Link>
              <Link href="/register" className="rounded-xl px-4 py-3 text-base text-fog">
                Create an account
              </Link>
            </>
          )}

          <Link
            href="/contact"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-teal px-5 py-3 text-sm font-semibold text-white"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Admin sub-navigation, rendered inside the /admin layout. */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1.5">
      {adminNav.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-teal text-white shadow-glow-teal"
                : "border border-line bg-base-800 text-fog hover:border-teal/60 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
