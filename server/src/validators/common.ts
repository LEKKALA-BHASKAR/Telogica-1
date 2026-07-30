import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const objectId = z
  .string()
  .refine((v) => isValidObjectId(v), { message: "Not a valid identifier" });

export const objectIdParam = z.object({ id: objectId });

/** Accepts a Mongo id, a slug, or a legacy catalogue id. */
export const productKeyParam = z.object({
  key: z.string().min(1, "Product identifier is required").max(120),
});

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const addressInput = z.object({
  label: z.string().trim().max(40).optional(),
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Address line 1 is required").max(160),
  line2: z.string().trim().max(160).optional().default(""),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
  postalCode: z
    .string()
    .trim()
    .min(4, "Enter a valid postal code")
    .max(12)
    .regex(/^[A-Za-z0-9\s-]+$/, "Enter a valid postal code"),
  country: z.string().trim().min(2).max(60).default("India"),
  isDefault: z.boolean().optional().default(false),
});

export type AddressInput = z.infer<typeof addressInput>;
