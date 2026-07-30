import type { Request, Response } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { Review } from "../models/Review";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildMeta, getPagination } from "../utils/query";

export const listProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query as Record<string, unknown>, 10);
  const filter = { product: req.params.id };

  const [items, total, breakdown] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    Review.countDocuments(filter),
    Review.aggregate<{ _id: number; count: number }>([
      { $match: filter },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]),
  ]);

  const histogram = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: breakdown.find((b) => b._id === star)?.count ?? 0,
  }));

  res.json({ success: true, data: { items, histogram }, meta: buildMeta(total, pagination) });
});

/**
 * Creates or edits the signed-in customer's review. Reviews are flagged as
 * verified when the account has a delivered order containing the product.
 */
export const upsertReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, title, comment } = req.body;

  const product = await Product.findById(req.params.id).select("_id isActive");
  if (!product || !product.isActive) throw ApiError.notFound("Product not found");

  const hasDelivered = await Order.exists({
    user: req.user!._id,
    status: "delivered",
    "items.product": product._id,
  });

  const existing = await Review.findOne({ product: product._id, user: req.user!._id });

  if (existing) {
    existing.rating = rating;
    existing.title = title ?? "";
    existing.comment = comment;
    existing.isVerifiedPurchase = Boolean(hasDelivered);
    await existing.save();
    res.json({ success: true, data: { review: existing } });
    return;
  }

  const review = await Review.create({
    product: product._id,
    user: req.user!._id,
    name: req.user!.name,
    rating,
    title: title ?? "",
    comment,
    isVerifiedPurchase: Boolean(hasDelivered),
  });

  res.status(201).json({ success: true, data: { review } });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound("Review not found");

  const isAuthor = review.user.toString() === req.user!._id.toString();
  if (!isAuthor && req.user!.role !== "admin") {
    throw ApiError.forbidden("You can only remove your own review");
  }

  await Review.findByIdAndDelete(review._id);
  res.json({ success: true, message: "Review removed" });
});

export const listMyReviews = asyncHandler(async (req: Request, res: Response) => {
  const items = await Review.find({ user: req.user!._id })
    .populate("product", "name slug images")
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data: { items } });
});
