import { z } from "zod";
import { ORDER_STATUSES, PAYMENT_METHODS } from "../models/Order";
import { QUOTE_STATUSES } from "../models/Quote";
import { MESSAGE_STATUSES } from "../models/Message";
import { addressInput, objectId } from "./common";

/* ── Cart ──────────────────────────────────────────────────────────────── */

export const addToCartBody = z.object({
  productId: objectId,
  qty: z.coerce.number().int().min(1, "Quantity must be at least 1").max(20).default(1),
});

export const updateCartItemBody = z.object({
  qty: z.coerce.number().int().min(0).max(20),
});

export const mergeCartBody = z.object({
  items: z
    .array(z.object({ productId: objectId, qty: z.coerce.number().int().min(1).max(20) }))
    .max(50)
    .default([]),
});

export const cartItemParams = z.object({ productId: objectId });

/* ── Orders ────────────────────────────────────────────────────────────── */

export const createOrderBody = z.object({
  shippingAddress: addressInput,
  paymentMethod: z.enum(PAYMENT_METHODS),
  customerNote: z.string().trim().max(1000).optional().default(""),
});

export const cancelOrderBody = z.object({
  reason: z.string().trim().max(300).optional(),
});

export const updateOrderStatusBody = z.object({
  status: z.enum(ORDER_STATUSES),
  note: z.string().trim().max(300).optional(),
  trackingNumber: z.string().trim().max(80).optional(),
  courier: z.string().trim().max(80).optional(),
});

/* ── Payments ──────────────────────────────────────────────────────────── */

export const paymentOrderBody = z.object({ orderId: objectId });

export const verifyPaymentBody = z.object({
  orderId: objectId,
  razorpayOrderId: z.string().min(4),
  razorpayPaymentId: z.string().min(4),
  razorpaySignature: z.string().min(4),
});

export const manualPaymentBody = z.object({
  reference: z.string().trim().max(120).optional(),
});

/* ── Reviews ───────────────────────────────────────────────────────────── */

export const reviewBody = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().max(120).optional().default(""),
  comment: z.string().trim().min(4, "Tell us a little more").max(2000),
});

/* ── Quotes ────────────────────────────────────────────────────────────── */

export const createQuoteBody = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().max(20).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
  items: z
    .array(
      z.object({
        productId: objectId.optional(),
        name: z.string().trim().max(200).optional(),
        qty: z.coerce.number().int().min(1).max(999).default(1),
      })
    )
    .max(25)
    .optional()
    .default([]),
});

export const updateQuoteBody = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
  quotedAmount: z.coerce.number().min(0).optional(),
  adminNotes: z.string().trim().max(4000).optional(),
});

/* ── Contact messages ──────────────────────────────────────────────────── */

export const createMessageBody = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().max(20).optional().default(""),
  subject: z.string().trim().max(160).optional().default("Sales Inquiry"),
  message: z.string().trim().min(10, "Please add a little more detail").max(5000),
  productRef: z.string().trim().max(200).optional(),
});

export const updateMessageBody = z.object({
  status: z.enum(MESSAGE_STATUSES),
});

/* ── Admin users ───────────────────────────────────────────────────────── */

export const updateUserBody = z.object({
  role: z.enum(["user", "admin"]).optional(),
  isActive: z.boolean().optional(),
});
