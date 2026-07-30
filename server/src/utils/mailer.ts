import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.SMTP_HOST || !env.SMTP_USER) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
}

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Sends mail when SMTP is configured; otherwise logs it. Delivery is never
 * allowed to fail a request — an order must not be lost because mail bounced.
 */
export async function sendMail({ to, subject, text, html }: MailOptions): Promise<void> {
  const tx = getTransporter();
  if (!tx) {
    console.log(`✉  [mail:dry-run] to=${to} subject="${subject}"\n${text}\n`);
    return;
  }
  try {
    await tx.sendMail({ from: env.EMAIL_FROM, to, subject, text, html });
  } catch (err) {
    console.error("✖ Email delivery failed:", err instanceof Error ? err.message : err);
  }
}
