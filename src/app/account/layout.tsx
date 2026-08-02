import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import type { ReactNode } from "react";
import { RequireAuth } from "@/components/commerce/AuthGuard";
import { AccountShell } from "@/components/commerce/AccountShell";

export const metadata: Metadata = privateMetadata("My account");

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AccountShell>{children}</AccountShell>
    </RequireAuth>
  );
}
