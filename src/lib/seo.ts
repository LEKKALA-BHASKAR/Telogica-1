import type { Metadata } from "next";
import { site } from "./site";

/**
 * The generated card from `app/opengraph-image.tsx`.
 *
 * Next's file-based `opengraph-image` convention only applies to its own route
 * segment — it does NOT cascade to child segments. Without this default every
 * page except the home page would share a link preview with no image, so
 * `pageMetadata` falls back to it explicitly.
 */
const DEFAULT_OG_IMAGE = {
  url: `${site.url}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.tagline}`,
  type: "image/png",
};

/**
 * Builds a complete, canonical-tagged metadata object for a marketing page.
 *
 * Every public page must call this. It guarantees the four things search and
 * social crawlers need and that Next.js will not infer on its own:
 *   1. a self-referencing canonical (kills duplicate-content splits from
 *      trailing slashes, tracking params and http/https or www variants),
 *   2. per-page Open Graph tags — Next inherits the *root* OG block otherwise,
 *      so every page would share the home page's title in a link preview,
 *   3. a Twitter/X summary_large_image card, and
 *   4. an og:image, defaulting to the generated route-level image.
 *
 * `path` is root-relative and must start with "/" ("" for the home page).
 */
export function pageMetadata({
  title,
  description,
  path,
  images,
  type = "website",
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  /** Absolute or root-relative image URLs. Falls back to the generated OG image. */
  images?: string[];
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const url = `${site.url}${path}`;
  const ogImages = images?.length
    ? images.map((src) => (src.startsWith("http") ? src : `${site.url}${src}`))
    : [DEFAULT_OG_IMAGE];
  return {
    // Absolute: the approved deck titles already carry the brand, so letting
    // the root "%s · Telogica" template append would duplicate it.
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: site.name,
      locale: "en_IN",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

/**
 * Metadata for pages that must never reach an index: authenticated areas,
 * checkout, cart and transactional confirmations. `robots.ts` disallows these
 * paths too, but a Disallow only stops *crawling* — a URL linked from
 * elsewhere can still be indexed URL-only. The noindex directive is what
 * actually keeps it out, so both are required.
 */
export function privateMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
  };
}
