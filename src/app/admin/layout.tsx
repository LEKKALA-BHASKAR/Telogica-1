import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RequireAuth } from "@/components/commerce/AuthGuard";
import { AdminNav } from "@/components/Header";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth adminOnly>
      <div className="container-x py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Control panel</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white">
              Telogica Admin
            </h1>
          </div>
          <AdminNav />
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </RequireAuth>
  );
}
