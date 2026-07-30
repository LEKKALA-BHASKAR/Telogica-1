import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/commerce/AuthForms";
import { Loading } from "@/components/commerce/Bits";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Telogica account to order test & measurement instruments, track deliveries and manage quote requests.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterForm />
    </Suspense>
  );
}
