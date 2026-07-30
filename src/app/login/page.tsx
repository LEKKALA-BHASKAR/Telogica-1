import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/commerce/AuthForms";
import { Loading } from "@/components/commerce/Bits";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Telogica account to track orders, manage quotes and check out faster.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
