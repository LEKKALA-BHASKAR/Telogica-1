import type { Request, Response } from "express";
import type { Types } from "mongoose";
import { env } from "../config/env";
import { Cart } from "../models/Cart";
import { Order, type IOrderItem, type OrderStatus } from "../models/Order";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendMail } from "../utils/mailer";
import { calculateTotals } from "../utils/pricing";
import { buildMeta, getPagination, resolveSort } from "../utils/query";
import { loadCart } from "./cartController";

const SORTS: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "total-desc": { totalPrice: -1 },
  "total-asc": { totalPrice: 1 },
};

/** Statuses an administrator may move an order into from its current state. */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["packed", "shipped", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};

const STOCK_RESTORING_STATUSES: OrderStatus[] = ["cancelled", "refunded"];

/**
 * Reserves stock line by line. A standalone mongod has no transactions, so a
 * partial reservation is compensated by putting back what was already taken.
 */
async function reserveStock(items: IOrderItem[]): Promise<void> {
  const reserved: IOrderItem[] = [];
  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.qty }, isActive: true },
      { $inc: { stock: -item.qty, soldCount: item.qty } },
      { new: true }
    );
    if (!updated) {
      await releaseStock(reserved);
      throw ApiError.conflict(
        `${item.name} sold out while you were checking out — please review your cart`
      );
    }
    reserved.push(item);
  }
}

async function releaseStock(items: IOrderItem[]): Promise<void> {
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty, soldCount: -item.qty },
      })
    )
  );
}

/* ── Customer ──────────────────────────────────────────────────────────── */

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { shippingAddress, paymentMethod, customerNote } = req.body;

  if (paymentMethod === "razorpay" && !env.razorpayEnabled) {
    throw ApiError.badRequest("Card payments are not configured — choose Cash on Delivery");
  }
  if (paymentMethod === "mock" && env.razorpayEnabled) {
    throw ApiError.badRequest("The demo gateway is disabled while Razorpay is configured");
  }

  const { lines } = await loadCart(req.user!._id);
  const payable = lines.filter((l) => !l.outOfStock && l.qty > 0);
  if (!payable.length) throw ApiError.badRequest("Your cart is empty");
  if (payable.length !== lines.length) {
    throw ApiError.badRequest("Some items are out of stock — remove them before checking out");
  }

  const items: IOrderItem[] = payable.map((l) => ({
    product: l.product as unknown as Types.ObjectId,
    name: l.name,
    slug: l.slug,
    image: l.image,
    sku: l.sku,
    price: l.price,
    qty: l.qty,
  }));

  // Totals are always recomputed here; the client's numbers are only a preview.
  const totals = calculateTotals(items.map((i) => ({ price: i.price, qty: i.qty })));

  await reserveStock(items);

  try {
    const order = await Order.create({
      user: req.user!._id,
      items,
      shippingAddress,
      paymentMethod,
      customerNote,
      currency: env.CURRENCY,
      ...totals,
      // COD orders go straight to the fulfilment queue; prepaid ones wait for capture.
      status: paymentMethod === "cod" ? "processing" : "pending",
    });

    await Cart.findOneAndUpdate({ user: req.user!._id }, { items: [] });

    await sendMail({
      to: req.user!.email,
      subject: `Telogica order ${order.orderNumber} received`,
      text:
        `Hi ${req.user!.name},\n\nWe've received order ${order.orderNumber} for ` +
        `${env.CURRENCY} ${order.totalPrice.toLocaleString("en-IN")}.\n\n` +
        `Track it at ${env.CLIENT_URL}/account/orders/${order._id.toString()}\n\n— Telogica Limited`,
    });

    res.status(201).json({ success: true, data: { order } });
  } catch (err) {
    await releaseStock(items);
    throw err;
  }
});

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query as Record<string, unknown>, 10);
  const filter = { user: req.user!._id };

  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, data: { items }, meta: buildMeta(total, pagination) });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone");
  if (!order) throw ApiError.notFound("Order not found");

  // `user` is populated here, so read the id off the document rather than the ref.
  const ownerId =
    (order.user as unknown as { _id?: Types.ObjectId })._id?.toString() ?? order.user.toString();
  if (ownerId !== req.user!._id.toString() && req.user!.role !== "admin") {
    throw ApiError.forbidden("You can only view your own orders");
  }

  res.json({ success: true, data: { order } });
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound("Order not found");

  const isOwner = order.user.toString() === req.user!._id.toString();
  if (!isOwner && req.user!.role !== "admin") {
    throw ApiError.forbidden("You can only cancel your own orders");
  }
  if (!["pending", "processing"].includes(order.status)) {
    throw ApiError.badRequest(
      `An order that is already ${order.status} can't be cancelled here — contact support@telogica.com`
    );
  }

  await releaseStock(order.items);

  order.status = "cancelled";
  order.cancelledAt = new Date();
  order.cancelReason = req.body.reason || "Cancelled by customer";
  order.statusHistory.push({ status: "cancelled", at: new Date(), note: order.cancelReason });
  await order.save();

  res.json({ success: true, data: { order } });
});

/* ── Admin ─────────────────────────────────────────────────────────────── */

export const adminListOrders = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query as Record<string, unknown>, 20);
  const sort = resolveSort(req.query.sort, SORTS, "newest");

  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.paid === "true") filter.isPaid = true;
  if (req.query.paid === "false") filter.isPaid = false;
  if (req.query.q) filter.orderNumber = new RegExp(String(req.query.q).trim(), "i");

  const [items, total, revenue] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Order.countDocuments(filter),
    Order.aggregate<{ _id: null; sum: number }>([
      { $match: { ...filter, isPaid: true } },
      { $group: { _id: null, sum: { $sum: "$totalPrice" } } },
    ]),
  ]);

  res.json({
    success: true,
    data: { items, paidRevenue: revenue[0]?.sum ?? 0 },
    meta: buildMeta(total, pagination),
  });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, note, trackingNumber, courier } = req.body as {
    status: OrderStatus;
    note?: string;
    trackingNumber?: string;
    courier?: string;
  };

  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound("Order not found");

  if (status !== order.status && !ALLOWED_TRANSITIONS[order.status].includes(status)) {
    throw ApiError.badRequest(
      `An order that is ${order.status} can only move to: ${
        ALLOWED_TRANSITIONS[order.status].join(", ") || "no further status"
      }`
    );
  }

  // Cancelling or refunding returns the reserved units to the catalogue exactly once.
  if (STOCK_RESTORING_STATUSES.includes(status) && !STOCK_RESTORING_STATUSES.includes(order.status)) {
    await releaseStock(order.items);
  }

  order.status = status;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (courier !== undefined) order.courier = courier;

  if (status === "delivered") {
    order.deliveredAt = new Date();
    // Cash on delivery settles when the courier hands it over.
    if (order.paymentMethod === "cod" && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }
  }
  if (status === "cancelled") {
    order.cancelledAt = new Date();
    order.cancelReason = note || "Cancelled by Telogica";
  }

  order.statusHistory.push({ status, at: new Date(), note });
  await order.save();

  const customer = await order.populate<{ user: { email: string; name: string } }>(
    "user",
    "name email"
  );
  await sendMail({
    to: customer.user.email,
    subject: `Order ${order.orderNumber} is now ${status}`,
    text:
      `Hi ${customer.user.name},\n\nYour order ${order.orderNumber} is now ${status}.` +
      (order.trackingNumber ? `\nTracking: ${order.courier ?? ""} ${order.trackingNumber}` : "") +
      `\n\n${env.CLIENT_URL}/account/orders/${order._id.toString()}\n\n— Telogica Limited`,
  });

  res.json({ success: true, data: { order } });
});
