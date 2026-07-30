import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { z } from "zod";

// Resolves to server/.env whether we are running from src/ (tsx) or dist/ (node).
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const bool = z
  .string()
  .optional()
  .transform((v) => v === "true" || v === "1");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // 5000 is taken by AirPlay Receiver on macOS, so the default sits one above it.
  PORT: z.coerce.number().int().positive().default(5001),
  CLIENT_URL: z.string().default("http://localhost:3000"),

  MONGO_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/telogica"),

  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("telogica_token"),

  ADMIN_NAME: z.string().default("Telogica Admin"),
  ADMIN_EMAIL: z.string().email().default("admin@telogica.com"),
  ADMIN_PASSWORD: z.string().min(6).default("Admin@12345"),

  RAZORPAY_KEY_ID: z.string().optional().default(""),
  RAZORPAY_KEY_SECRET: z.string().optional().default(""),

  TAX_RATE: z.coerce.number().min(0).max(1).default(0.18),
  FREE_SHIPPING_THRESHOLD: z.coerce.number().min(0).default(25000),
  SHIPPING_FLAT_RATE: z.coerce.number().min(0).default(750),
  CURRENCY: z.string().default("INR"),

  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  EMAIL_FROM: z.string().default("Telogica <no-reply@telogica.com>"),

  TRUST_PROXY: bool,
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  // A misconfigured environment is never worth booting through.
  console.error(`\n✖ Invalid server environment:\n${issues}\n`);
  process.exit(1);
}

const raw = parsed.data;
const isProd = raw.NODE_ENV === "production";

// A missing secret is fatal in production, but must not block a first `npm run dev`.
let jwtSecret = raw.JWT_SECRET?.trim() ?? "";
if (!jwtSecret || jwtSecret.length < 32 || jwtSecret.startsWith("change-me")) {
  if (isProd) {
    console.error(
      "\n✖ JWT_SECRET must be set to a random string of at least 32 characters in production.\n" +
        '  Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"\n'
    );
    process.exit(1);
  }
  jwtSecret = crypto.randomBytes(48).toString("hex");
  console.warn(
    "⚠  JWT_SECRET is unset or too short — using a random development secret.\n" +
      "   Sessions will not survive a server restart. Set JWT_SECRET in server/.env."
  );
}

export const env = {
  ...raw,
  JWT_SECRET: jwtSecret,
  isProd,
  isDev: raw.NODE_ENV === "development",
  isTest: raw.NODE_ENV === "test",
  /** Razorpay is only "live" when both halves of the key pair are present. */
  razorpayEnabled: Boolean(raw.RAZORPAY_KEY_ID && raw.RAZORPAY_KEY_SECRET),
};

export type Env = typeof env;
