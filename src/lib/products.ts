import productsData from "@/data/products.json";
import clientsData from "@/data/clients.json";

export type Category = "Telecommunication" | "Railway" | "Defence";

export interface Product {
  id: string;
  name: string;
  /** Primary category — used for the card badge. */
  category: Category;
  /** All sectors this instrument serves (a product may serve several). */
  sectors: Category[];
  description: string;
  images: string[];
  features: string[];
  warrantyMonths: number | null;
  requiresQuote: boolean;
}

export interface Client {
  name: string;
  logo: string | null;
  order: number;
}

/** 27 distinct instruments, each carrying the set of sectors it serves. */
export const allProducts: Product[] = (productsData as Product[])
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name));

export const clients: Client[] = (clientsData as Client[]).filter((c) => c.logo);

export function productsByCategory(cat: Category): Product[] {
  return allProducts.filter((p) => p.sectors.includes(cat));
}

export function getProduct(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

/** Up to `n` other products that share a sector (excluding `id`). */
export function relatedProducts(id: string, n = 4): Product[] {
  const current = getProduct(id);
  if (!current) return [];
  return allProducts
    .filter(
      (p) => p.id !== id && p.images[0] && p.sectors.some((s) => current.sectors.includes(s))
    )
    .slice(0, n);
}

/** Parse a long description into a lead paragraph + bullet features. */
export function parseDescription(desc: string): { lead: string; bullets: string[] } {
  const text = desc.replace(/\r/g, "").trim();
  const keyIdx = text.search(/key features\s*:/i);
  if (keyIdx === -1) {
    return { lead: text, bullets: [] };
  }
  const lead = text.slice(0, keyIdx).trim();
  const rest = text.slice(keyIdx).replace(/key features\s*:/i, "").trim();
  const bullets = rest
    .split(/\n|(?<=[a-z])\s*,\s*(?=[A-Z0-9])/)
    .map((s) => s.replace(/^[•\-•\s]+/, "").trim())
    .filter((s) => s.length > 1);
  return { lead, bullets };
}

/** Clean a raw product name like "OTDR\tSmart OTDR 321J" into title + family. */
export function splitName(name: string): { family: string; title: string } {
  const cleaned = name.replace(/\s+/g, " ").trim();
  const sep = cleaned.search(/[-–]| {2,}/);
  // Heuristic: many names are "Family  Model" or "Family-Model"
  const dash = cleaned.indexOf("-");
  if (dash > 2 && dash < cleaned.length - 2) {
    return {
      family: cleaned.slice(0, dash).trim(),
      title: cleaned.slice(dash + 1).trim(),
    };
  }
  void sep;
  return { family: "", title: cleaned };
}

/** First sentence / short blurb from a long description. */
export function shortDesc(desc: string, max = 130): string {
  const firstLine = desc.split("\n")[0].trim();
  if (firstLine.length <= max) return firstLine;
  return firstLine.slice(0, max).replace(/[\s,]+\S*$/, "") + "…";
}

export const categoryMeta: Record<
  Category,
  { label: string; blurb: string; href: string }
> = {
  Telecommunication: {
    label: "Telecommunication",
    blurb:
      "Field-proven fiber, copper and RF test instruments for building and maintaining modern telecom networks.",
    href: "/solutions/telecommunication",
  },
  Railway: {
    label: "Railway",
    blurb:
      "Ruggedised fiber splicing, OTDR and route-marker systems engineered for trackside and signalling networks.",
    href: "/solutions/railway",
  },
  Defence: {
    label: "Defence & Military",
    blurb:
      "High-resolution optical instrumentation and secure communication test platforms for critical defence programmes.",
    href: "/solutions/defence",
  },
};

export const categoryCounts = {
  Telecommunication: productsByCategory("Telecommunication").length,
  Railway: productsByCategory("Railway").length,
  Defence: productsByCategory("Defence").length,
  total: allProducts.length,
};
