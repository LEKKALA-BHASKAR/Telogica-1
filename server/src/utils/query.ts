/** Shared helpers for list endpoints: pagination, sorting, and safe numbers. */

export interface Pagination {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(query: Record<string, unknown>, defaultLimit = 12): Pagination {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function buildMeta(total: number, { page, limit }: Pagination) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return { total, page, pages, limit, hasNext: page < pages, hasPrev: page > 1 };
}

/**
 * Maps a client sort key to a Mongo sort object. Only known keys are honoured,
 * so a request can never inject an arbitrary sort expression.
 */
export function resolveSort(
  key: unknown,
  allowed: Record<string, Record<string, 1 | -1>>,
  fallback: string
): Record<string, 1 | -1> {
  const name = typeof key === "string" && key in allowed ? key : fallback;
  return allowed[name];
}

/** Escapes a user string so it can be used inside a RegExp safely. */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
