import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { RegisterForm } from "@/components/commerce/AuthForms";
import { Loading } from "@/components/commerce/Bits";

export const metadata: Metadata = privateMetadata("Create an account");

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterForm />
    </Suspense>
  );
}
