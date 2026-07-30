import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RequireAuth } from "@/components/commerce/AuthGuard";
import { AccountShell } from "@/components/commerce/AccountShell";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AccountShell>{children}</AccountShell>
    </RequireAuth>
  );
}
