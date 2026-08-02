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

/**
 * Company-level structured data. Typed as `Corporation` rather than plain
 * `Organization` because Telogica is BSE-listed — `tickerSymbol` and
 * `isicV4`-style identifiers only carry meaning on a corporate subtype, and it
 * is what powers the knowledge-panel entry for a listed company.
 */
export function OrganizationSchema() {
  const address = {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500033",
    addressCountry: "IN",
  };

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Corporation",
        "@id": `${site.url}/#organization`,
        name: site.name,
        alternateName: [site.shortName, "Aishwarya Technologies and Telecom Ltd"],
        legalName: site.name,
        url: site.url,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/logo-full.svg`,
          caption: site.name,
        },
        image: `${site.url}/opengraph-image`,
        description: site.description,
        email: site.email.sales,
        telephone: site.phones[0],
        tickerSymbol: "BSE:532975",
        address,
        location: {
          "@type": "Place",
          name: "Telogica Limited — Hyderabad facility",
          address,
          geo: { "@type": "GeoCoordinates", latitude: 17.430595, longitude: 78.409771 },
        },
        areaServed: { "@type": "Country", name: "India" },
        knowsAbout: [
          "Telecom test and measurement equipment",
          "Optical time-domain reflectometers",
          "Fusion splicing machines",
          "Cable fault and route locators",
          "Railway optical fibre and signalling test equipment",
          "RF power amplifiers 100 MHz to 40 GHz",
          "Electronics manufacturing services",
        ],
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "certification",
          name: "ISO 9001:2015",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: site.email.sales,
            telephone: site.phones[0],
            areaServed: "IN",
            availableLanguage: ["en", "hi", "te"],
          },
          {
            "@type": "ContactPoint",
            contactType: "technical support",
            email: site.email.support,
            areaServed: "IN",
            availableLanguage: ["en"],
          },
          {
            "@type": "ContactPoint",
            contactType: "investor relations",
            email: site.email.investors,
            areaServed: "IN",
            availableLanguage: ["en"],
          },
        ],
        sameAs: [site.social.linkedin, site.social.facebook, site.social.youtube],
      }}
    />
  );
}

/** Site-level entity, linked to the organisation above by @id. */
export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en-IN",
        publisher: { "@id": `${site.url}/#organization` },
      }}
    />
  );
}

/** ItemList for category/listing pages, so results can show a carousel. */
export function ItemListSchema({
  name,
  items,
}: {
  name: string;
  items: { name: string; href: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        numberOfItems: items.length,
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          url: `${site.url}${item.href}`,
        })),
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
