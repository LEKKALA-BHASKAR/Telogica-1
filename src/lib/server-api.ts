import type { ApiProduct, PageMeta } from "./types";

/**
 * Server-component data access. Talks to the Express API directly (not through
 * the Next rewrite) and returns null on failure, so a marketing page still
 * renders when the API or MongoDB is down.
 */
const BASE =
  process.env.API_INTERNAL_URL ??
  `${process.env.API_PROXY_TARGET ?? "http://localhost:5001"}/api/v1`;

async function get<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { success: boolean; data: T };
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

export async function getProductByKey(key: string) {
  return get<{ product: ApiProduct; related: ApiProduct[] }>(
    `/products/${encodeURIComponent(key)}`
  );
}

export async function listProducts(
  params: Record<string, string | number | boolean> = {}
): Promise<{ items: ApiProduct[]; meta?: PageMeta } | null> {
  const search = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`${BASE}/products${search ? `?${search}` : ""}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      success: boolean;
      data: { items: ApiProduct[] };
      meta?: PageMeta;
    };
    return body.success ? { items: body.data.items, meta: body.meta } : null;
  } catch {
    return null;
  }
}

export async function getFeaturedProducts() {
  const data = await get<{ items: ApiProduct[] }>("/products/featured", 300);
  return data?.items ?? [];
}
