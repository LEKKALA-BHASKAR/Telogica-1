"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { logout } from "@/store/authSlice";
import { resetToGuest } from "@/store/cartSlice";
import { useAppDispatch, useAuth } from "@/store/hooks";
import { Dashboard, Heart, LogOut, MapPin, FileText, Package, User } from "../Icons";

const links = [
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/quotes", label: "Quote requests", icon: FileText },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account", label: "Profile", icon: User },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();

  // Order detail pages render standalone — no sidebar chrome around them.
  if (/^\/account\/orders\/[^/]+$/.test(pathname)) return <>{children}</>;

  async function onSignOut() {
    await dispatch(logout());
    dispatch(resetToGuest());
    toast.success("Signed out");
    router.push("/");
  }

  return (
    <div className="container-x py-12 sm:py-16">
      <div className="flex flex-wrap items-center gap-4">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient font-display text-xl font-bold text-black">
          {user?.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {user?.name}
          </h1>
          <p className="text-sm text-fog">{user?.email}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {links.map((link) => {
              const active =
                link.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-base-700 text-white"
                      : "text-fog hover:bg-base-800 hover:text-white"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-teal transition hover:bg-base-800"
              >
                <Dashboard className="h-4 w-4" /> Admin panel
              </Link>
            )}

            <button
              onClick={onSignOut}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-fog transition hover:bg-base-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
