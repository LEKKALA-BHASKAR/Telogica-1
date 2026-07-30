import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/commerce/AuthForms";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your Telogica account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
