import type { Request, Response } from "express";
import { Message } from "../models/Message";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { Quote } from "../models/Quote";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildMeta, escapeRegex, getPagination } from "../utils/query";
import { publicUser } from "./authController";

const LOW_STOCK_THRESHOLD = 5;

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const since = new Date();
  since.setMonth(since.getMonth() - 11, 1);
  since.setHours(0, 0, 0, 0);

  const [
    revenue,
    orderCounts,
    productCount,
    quoteOnlyCount,
    lowStock,
    userCount,
    openQuotes,
    newMessages,
    recentOrders,
    topProducts,
    monthly,
  ] = await Promise.all([
    Order.aggregate<{ _id: null; total: number; count: number }>([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
    ]),
    Order.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true, requiresQuote: true }),
    Product.find({ isActive: true, requiresQuote: false, stock: { $lte: LOW_STOCK_THRESHOLD } })
      .select("name slug sku stock price")
      .sort({ stock: 1 })
      .limit(8)
      .lean(),
    User.countDocuments({ role: "user" }),
    Quote.countDocuments({ status: { $in: ["new", "in_review"] } }),
    Message.countDocuments({ status: "new" }),
    Order.find()
      .populate("user", "name email")
      .select("orderNumber totalPrice status isPaid createdAt user")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    Order.aggregate<{ _id: string; name: string; qty: number; revenue: number }>([
      { $match: { status: { $nin: ["cancelled", "refunded"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          qty: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 6 },
    ]),
    Order.aggregate<{ _id: { y: number; m: number }; revenue: number; orders: number }>([
      { $match: { createdAt: { $gte: since }, status: { $nin: ["cancelled"] } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ]),
  ]);

  const statusCounts = Object.fromEntries(orderCounts.map((s) => [s._id, s.count]));

  res.json({
    success: true,
    data: {
      revenue: {
        paidTotal: revenue[0]?.total ?? 0,
        paidOrders: revenue[0]?.count ?? 0,
        averageOrderValue: revenue[0]?.count ? revenue[0].total / revenue[0].count : 0,
      },
      orders: {
        total: orderCounts.reduce((sum, s) => sum + s.count, 0),
        byStatus: statusCounts,
        awaitingFulfilment: (statusCounts.processing ?? 0) + (statusCounts.packed ?? 0),
      },
      catalogue: {
        active: productCount,
        quoteOnly: quoteOnlyCount,
        lowStock,
        lowStockThreshold: LOW_STOCK_THRESHOLD,
      },
      customers: userCount,
      openQuotes,
      newMessages,
      recentOrders,
      topProducts,
      monthly: monthly.map((m) => ({
        month: `${m._id.y}-${String(m._id.m).padStart(2, "0")}`,
        revenue: m.revenue,
        orders: m.orders,
      })),
    },
  });
});

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query as Record<string, unknown>, 20);
  const filter: Record<string, unknown> = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).trim()), "i");
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("name email phone company role isActive createdAt lastLoginAt")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, data: { items }, meta: buildMeta(total, pagination) });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");

  const isSelf = user._id.toString() === req.user!._id.toString();
  const { role, isActive } = req.body as { role?: "user" | "admin"; isActive?: boolean };

  // Guard against an administrator locking themselves out of the panel.
  if (isSelf && (role === "user" || isActive === false)) {
    throw ApiError.badRequest("You can't remove your own administrator access");
  }
  if (role === "user" && user.role === "admin") {
    const admins = await User.countDocuments({ role: "admin", isActive: true });
    if (admins <= 1) throw ApiError.badRequest("At least one active administrator must remain");
  }

  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  await user.save();

  res.json({ success: true, data: { user: publicUser(user) } });
});
