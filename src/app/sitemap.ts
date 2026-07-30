import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listProducts } from "@/lib/server-api";

// Product slugs come from MongoDB, so the sitemap is generated per request.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const staticRoutes = [
    "",
    "/about",
    "/capabilities",
    "/solutions",
    "/solutions/telecommunication",
    "/solutions/railway",
    "/solutions/defence",
    "/products",
    "/clients",
    "/investors",
    "/contact",
    "/quote",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  // If the API is unreachable the sitemap still lists every marketing route.
  const result = await listProducts({ limit: 100, sort: "name" });
  const productRoutes = (result?.items ?? []).map((p) => ({
    url: `${base}/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
