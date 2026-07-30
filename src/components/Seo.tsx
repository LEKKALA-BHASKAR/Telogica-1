import { cleanName } from "@/lib/format";
import { site } from "@/lib/site";
import type { ApiProduct } from "@/lib/types";

/** Emits a JSON-LD block. Server-rendered, so crawlers see it in the HTML. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own data, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        alternateName: site.shortName,
        url: site.url,
        logo: `${site.url}/logo-full.svg`,
        description: site.description,
        email: site.email.sales,
        telephone: site.phones[0],
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.address.line1}, ${site.address.line2}`,
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          postalCode: "500033",
          addressCountry: "IN",
        },
        sameAs: [site.social.linkedin, site.social.facebook, site.social.youtube],
      }}
    />
  );
}

export function ProductSchema({ product }: { product: ApiProduct }) {
  const name = cleanName(product.name);
  const url = `${site.url}/products/${product.slug}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        sku: product.sku,
        description: product.shortDescription || name,
        image: product.images.map((img) =>
          img.startsWith("http") ? img : `${site.url}${img}`
        ),
        brand: { "@type": "Brand", name: product.brand || site.shortName },
        category: product.category,
        ...(product.numReviews > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.numReviews,
              },
            }
          : {}),
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "INR",
          // Quote-only lines advertise no price; schema.org expects "0" with a
          // PreOrder-style availability rather than a fabricated figure.
          price: product.requiresQuote ? 0 : product.price,
          availability: product.requiresQuote
            ? "https://schema.org/PreOrder"
            : product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: site.name },
        },
      }}
    />
  );
}

export function BreadcrumbSchema({ trail }: { trail: { name: string; href: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: `${site.url}${crumb.href}`,
        })),
      }}
    />
  );
}
