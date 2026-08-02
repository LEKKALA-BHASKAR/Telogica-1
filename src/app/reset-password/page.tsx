import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/commerce/AuthForms";
import { Loading } from "@/components/commerce/Bits";

export const metadata: Metadata = privateMetadata("Reset password");

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
