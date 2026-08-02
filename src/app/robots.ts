import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Authenticated, transactional and single-use routes. Crawling them wastes
 * crawl budget and risks thin/duplicate pages in the index; each also carries
 * a `noindex` via `privateMetadata()`, which is what actually removes them if
 * they were ever linked from elsewhere.
 */
const disallow = [
  "/admin",
  "/account",
  "/cart",
  "/checkout",
  "/order-confirmed",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
