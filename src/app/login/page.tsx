import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { LoginForm } from "@/components/commerce/AuthForms";
import { Loading } from "@/components/commerce/Bits";

export const metadata: Metadata = privateMetadata("Sign in");

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
