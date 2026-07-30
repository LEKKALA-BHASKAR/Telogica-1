import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { env } from "./config/env";
import { ApiError } from "./utils/ApiError";
import { errorHandler, notFound } from "./middleware/error";
import { sanitizeRequest } from "./middleware/sanitize";
import { UPLOAD_DIR } from "./middleware/upload";
import routes from "./routes";

export const API_PREFIX = "/api/v1";

export function createApp() {
  const app = express();

  if (env.TRUST_PROXY) app.set("trust proxy", 1);

  app.use(
    helmet({
      // Images are served cross-origin to the Next.js dev server on :3000.
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false,
    })
  );

  const allowedOrigins = new Set(
    [env.CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"].filter(Boolean)
  );
  // Next picks the next free port when 3000 is taken, so in development any
  // loopback origin is accepted rather than pinning a single port.
  const isLoopback = (origin: string) =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

  app.use(
    cors({
      origin(origin, callback) {
        // Same-origin and server-side requests arrive without an Origin header.
        if (!origin || allowedOrigins.has(origin)) return callback(null, true);
        if (!env.isProd && isLoopback(origin)) return callback(null, true);
        // A rejected origin is a client mistake, not a server fault.
        callback(ApiError.forbidden(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
  app.use(compression());
  app.use(sanitizeRequest);

  if (!env.isTest) {
    app.use(morgan(env.isProd ? "combined" : "dev"));
  }

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: env.isProd ? 300 : 2000,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: { success: false, message: "Too many requests — please slow down" },
    })
  );

  // Also exposed by Next.js from /public, but handy when the API runs alone.
  app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "7d" }));
  app.use(
    "/products",
    express.static(path.resolve(__dirname, "../../public/products"), { maxAge: "7d" })
  );

  app.get("/health", (_req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({
      success: true,
      status: "ok",
      uptime: Math.round(process.uptime()),
      database: states[mongoose.connection.readyState] ?? "unknown",
      environment: env.NODE_ENV,
    });
  });

  app.use(API_PREFIX, routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
