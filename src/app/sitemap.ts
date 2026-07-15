import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { allProducts } from "@/lib/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
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
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = allProducts.map((p) => ({
    url: `${base}/products/${p.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
