import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MulterError } from "multer";
import { ZodError } from "zod";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} does not exist`));
}

interface ErrorBody {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}

/**
 * Translates the error shapes this app actually produces — Zod, Mongoose,
 * JWT, Multer — into a single JSON envelope the client can rely on.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = "Please correct the highlighted fields";
    errors = err.issues.map((i) => ({ field: i.path.join("."), message: i.message }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = "Please correct the highlighted fields";
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err instanceof MulterError) {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : `Upload failed: ${err.message}`;
  } else if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
    statusCode = 409;
    const key = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0];
    message = key ? `That ${key} is already in use` : "That record already exists";
  } else if (err instanceof Error && err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Your session is invalid — please sign in again";
  } else if (err instanceof Error && err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired — please sign in again";
  } else if (err instanceof Error) {
    message = env.isProd ? "Something went wrong" : err.message;
  }

  if (statusCode >= 500) {
    console.error("✖ Unhandled error:", err);
  }

  const body: ErrorBody = { success: false, message };
  if (errors) body.errors = errors;
  if (!env.isProd && err instanceof Error) body.stack = err.stack;

  res.status(statusCode).json(body);
}
