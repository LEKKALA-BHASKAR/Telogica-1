import { z } from "zod";
import { CATEGORIES } from "../models/Product";

const category = z.enum(CATEGORIES);
const boolish = z
  .union([z.boolean(), z.enum(["true", "false", "1", "0"])])
  .transform((v) => v === true || v === "true" || v === "1");

export const listProductsQuery = z.object({
  q: z.string().trim().max(120).optional(),
  category: category.optional(),
  sector: category.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  inStock: boolish.optional(),
  featured: boolish.optional(),
  buyable: boolish.optional(),
  sort: z
    .enum(["relevance", "newest", "price-asc", "price-desc", "rating", "name", "popular"])
    .optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const specItem = z.object({
  key: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(200),
});

const productBase = z.object({
  name: z.string().trim().min(3, "Product name is required").max(180),
  sku: z.string().trim().min(2, "SKU is required").max(40),
  brand: z.string().trim().max(80).optional(),
  category,
  sectors: z.array(category).min(1, "Choose at least one sector"),
  description: z.string().trim().min(10, "Description is required").max(20000),
  shortDescription: z.string().trim().max(400).optional(),
  images: z.array(z.string().trim().min(1)).max(12).optional(),
  features: z.array(z.string().trim().min(1).max(300)).max(60).optional(),
  specs: z.array(specItem).max(60).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  price: z.coerce.number().min(0).optional(),
  mrp: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  warrantyMonths: z.coerce.number().int().min(0).max(240).nullable().optional(),
  requiresQuote: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const mrpNotBelowPrice = {
  message: "MRP cannot be lower than the selling price",
  path: ["mrp"],
};

export const createProductBody = productBase
  .refine((v) => v.requiresQuote || (v.price ?? 0) > 0, {
    message: "Set a price, or mark the product as quote-only",
    path: ["price"],
  })
  .refine((v) => !v.mrp || !v.price || v.mrp >= v.price, mrpNotBelowPrice);

// Every field optional on update — a partial edit must not require resending the product.
export const updateProductBody = productBase
  .partial()
  .refine((v) => !v.mrp || !v.price || v.mrp >= v.price, mrpNotBelowPrice);
