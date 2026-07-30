import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../utils/token";

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7).trim();
  const cookie = (req.cookies as Record<string, string> | undefined)?.[env.COOKIE_NAME];
  return cookie || null;
}

async function resolveUser(req: Request) {
  const token = extractToken(req);
  if (!token) return null;
  try {
    const { id } = verifyToken(token);
    const user = await User.findById(id);
    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

/** Requires a valid session; rejects with 401 otherwise. */
export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const user = await resolveUser(req);
  if (!user) throw ApiError.unauthorized("Please sign in to continue");
  req.user = user;
  next();
});

/** Attaches the user when a session exists, but never blocks the request. */
export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = await resolveUser(req);
    if (user) req.user = user;
    next();
  }
);

/** Route guard for privileged roles. Must run after `protect`. */
export const restrictTo =
  (...roles: Array<"user" | "admin">) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized("Please sign in to continue"));
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("This action requires an administrator account"));
    }
    next();
  };

export const adminOnly = [protect, restrictTo("admin")];
