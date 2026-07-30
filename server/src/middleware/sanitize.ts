import type { NextFunction, Request, Response } from "express";

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Strips keys that Mongo would treat as operators (`$gt`) or paths (`a.b`). */
function scrub(value: unknown, depth = 0): unknown {
  if (depth > 8) return value;
  if (Array.isArray(value)) return value.map((v) => scrub(v, depth + 1));
  if (!isPlainObject(value)) return value;

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value)) {
    if (key.startsWith("$") || key.includes(".")) continue;
    out[key] = scrub(val, depth + 1);
  }
  return out;
}

/**
 * NoSQL-injection guard. Runs before validation so a payload like
 * `{ email: { $ne: null } }` can never reach a query builder.
 */
export function sanitizeRequest(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) req.body = scrub(req.body);
  if (req.params) req.params = scrub(req.params) as Request["params"];
  if (req.query) {
    const cleaned = scrub(req.query) as Record<string, unknown>;
    const target = req.query as Record<string, unknown>;
    Object.keys(target).forEach((k) => delete target[k]);
    Object.assign(target, cleaned);
  }
  next();
}
