"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/store/hooks";
import { Loading } from "./Bits";

/**
 * Client-side route guard. The API enforces the same rules, so this only
 * decides what to render — it is never the security boundary.
 */
export function RequireAuth({
  children,
  adminOnly = false,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "ready") return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (adminOnly && user.role !== "admin") {
      router.replace("/account");
    }
  }, [user, status, adminOnly, router, pathname]);

  if (status !== "ready") return <Loading label="Checking your session…" />;
  if (!user) return <Loading label="Redirecting to sign in…" />;
  if (adminOnly && user.role !== "admin") return <Loading label="Redirecting…" />;

  return <>{children}</>;
}
