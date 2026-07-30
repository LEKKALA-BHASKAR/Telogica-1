import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/commerce/AuthForms";
import { Loading } from "@/components/commerce/Bits";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Telogica account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
