import crypto from "crypto";
import type { Request, Response } from "express";
import Razorpay from "razorpay";
import { env } from "../config/env";
import { Order } from "../models/Order";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendMail } from "../utils/mailer";

let client: Razorpay | null = null;

function razorpay(): Razorpay {
  if (!env.razorpayEnabled) {
    throw ApiError.badRequest("Razorpay is not configured on this server");
  }
  if (!client) {
    client = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return client;
}

async function loadOwnOrder(req: Request) {
  const order = await Order.findById(req.body.orderId);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== "admin") {
    throw ApiError.forbidden("You can only pay for your own orders");
  }
  if (order.isPaid) throw ApiError.badRequest("That order has already been paid");
  if (order.status === "cancelled") throw ApiError.badRequest("That order was cancelled");
  return order;
}

async function markPaid(
  orderId: string,
  payment: { id: string; orderId?: string; signature?: string; status: string; email?: string }
) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found");

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = { ...payment, updatedAt: new Date() };
  if (order.status === "pending") {
    order.status = "processing";
    order.statusHistory.push({ status: "processing", at: new Date(), note: "Payment received" });
  }
  await order.save();
  return order;
}

/** Tells the storefront which gateway to render, and with which public key. */
export const getPaymentConfig = asyncHandler(async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      provider: env.razorpayEnabled ? "razorpay" : "mock",
      razorpayKeyId: env.razorpayEnabled ? env.RAZORPAY_KEY_ID : "",
      codEnabled: true,
      currency: env.CURRENCY,
    },
  });
});

export const createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await loadOwnOrder(req);

  const rzpOrder = await razorpay().orders.create({
    // Razorpay works in the smallest currency unit — paise for INR.
    amount: Math.round(order.totalPrice * 100),
    currency: order.currency || env.CURRENCY,
    receipt: order.orderNumber,
    notes: { orderId: order._id.toString(), orderNumber: order.orderNumber },
  });

  order.paymentResult = { ...order.paymentResult, orderId: rzpOrder.id, status: "created" };
  await order.save();

  res.status(201).json({
    success: true,
    data: {
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: env.RAZORPAY_KEY_ID,
      orderNumber: order.orderNumber,
    },
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const order = await loadOwnOrder(req);

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const provided = Buffer.from(razorpaySignature);
  const computed = Buffer.from(expected);
  const valid =
    provided.length === computed.length && crypto.timingSafeEqual(provided, computed);

  if (!valid) {
    order.paymentResult = { ...order.paymentResult, status: "signature_failed", updatedAt: new Date() };
    await order.save();
    throw ApiError.badRequest("We could not verify that payment. No money has been captured.");
  }

  const paid = await markPaid(orderId, {
    id: razorpayPaymentId,
    orderId: razorpayOrderId,
    signature: razorpaySignature,
    status: "captured",
    email: req.user!.email,
  });

  await sendMail({
    to: req.user!.email,
    subject: `Payment received for ${paid.orderNumber}`,
    text: `Hi ${req.user!.name},\n\nWe've received ${paid.currency} ${paid.totalPrice.toLocaleString(
      "en-IN"
    )} for order ${paid.orderNumber}. It's now being prepared.\n\n— Telogica Limited`,
  });

  res.json({ success: true, data: { order: paid } });
});

/**
 * Demo gateway. Only reachable while Razorpay is unconfigured, so a real
 * deployment can never settle an order without a verified payment.
 */
export const payWithMockGateway = asyncHandler(async (req: Request, res: Response) => {
  if (env.razorpayEnabled) {
    throw ApiError.forbidden("The demo gateway is disabled while Razorpay is configured");
  }
  const order = await loadOwnOrder(req);
  const paid = await markPaid(order._id.toString(), {
    id: `mock_${crypto.randomBytes(8).toString("hex")}`,
    status: "captured_mock",
    email: req.user!.email,
  });
  res.json({ success: true, data: { order: paid } });
});

/** Admin-only settlement for bank transfers and cash taken outside the app. */
export const markOrderPaidManually = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.isPaid) throw ApiError.badRequest("That order is already marked paid");

  const paid = await markPaid(order._id.toString(), {
    id: req.body.reference || `manual_${Date.now()}`,
    status: "manual",
  });
  res.json({ success: true, data: { order: paid } });
});
