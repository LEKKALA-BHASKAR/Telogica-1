import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listProducts } from "@/lib/server-api";
import { documentHref, investorDocuments, isLocalDocument } from "@/lib/investor-documents";

// Product slugs come from MongoDB, so the sitemap is generated per request.
export const dynamic = "force-dynamic";

/**
 * Marketing routes, weighted by commercial importance. Priority is only a
 * relative hint within our own site — it tells crawlers which pages to revisit
 * first, so the money pages (home, products, the three industry pages) sit
 * above the boilerplate.
 */
const routes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/solutions", priority: 0.85, changeFrequency: "monthly" },
  { path: "/solutions/telecommunication", priority: 0.85, changeFrequency: "monthly" },
  { path: "/solutions/railway", priority: 0.85, changeFrequency: "monthly" },
  { path: "/solutions/defence", priority: 0.85, changeFrequency: "monthly" },
  { path: "/capabilities", priority: 0.8, changeFrequency: "monthly" },
  { path: "/manufacturing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/clients", priority: 0.6, changeFrequency: "monthly" },
  // Filings change on a statutory cadence, so this page turns over fastest.
  { path: "/investors", priority: 0.6, changeFrequency: "daily" },
  { path: "/quote", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const now = new Date();

  const staticRoutes = routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Google indexes PDFs as standalone documents. Listing the ones we host makes
  // annual reports and results discoverable on their own, which matters for
  // shareholders searching by company + financial year.
  const documentRoutes = investorDocuments
    .filter(isLocalDocument)
    .map((doc) => ({
      url: `${base}${documentHref(doc)}`,
      lastModified: doc.date ? new Date(doc.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    }));

  // If the API is unreachable the sitemap still lists every marketing route.
  const result = await listProducts({ limit: 100, sort: "name" });
  const productRoutes = (result?.items ?? []).map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    // Image extensions let product photos surface in Google Images.
    images: p.images
      ?.filter(Boolean)
      .map((img) => (img.startsWith("http") ? img : `${base}${img}`)),
  }));

  return [...staticRoutes, ...documentRoutes, ...productRoutes];
}
