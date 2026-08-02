import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo";
import { ForgotPasswordForm } from "@/components/commerce/AuthForms";

export const metadata: Metadata = privateMetadata("Forgot password");

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
