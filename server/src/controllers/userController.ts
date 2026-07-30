import type { Request, Response } from "express";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { publicUser } from "./authController";

/* ── Addresses ─────────────────────────────────────────────────────────── */

export const listAddresses = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: { addresses: req.user!.addresses } });
});

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  if (user.addresses.length >= 10) {
    throw ApiError.badRequest("You can save up to 10 addresses");
  }
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json({ success: true, data: { user: publicUser(user) } });
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const address = user.addresses.find((a) => a._id?.toString() === req.params.id);
  if (!address) throw ApiError.notFound("Address not found");

  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  Object.assign(address, req.body);
  user.markModified("addresses");
  await user.save();
  res.json({ success: true, data: { user: publicUser(user) } });
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const before = user.addresses.length;
  user.addresses = user.addresses.filter((a) => a._id?.toString() !== req.params.id);
  if (user.addresses.length === before) throw ApiError.notFound("Address not found");
  user.markModified("addresses");
  await user.save();
  res.json({ success: true, data: { user: publicUser(user) } });
});

/* ── Wishlist ──────────────────────────────────────────────────────────── */

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  // Same projection the catalogue uses, so a saved item renders in a full card.
  const user = await req.user!.populate({
    path: "wishlist",
    select:
      "name slug sku category sectors images price mrp stock requiresQuote rating numReviews warrantyMonths shortDescription isFeatured isActive",
  });
  res.json({ success: true, data: { items: user.wishlist } });
});

export const toggleWishlist = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const product = await Product.findById(req.params.id).select("_id");
  if (!product) throw ApiError.notFound("Product not found");

  const index = user.wishlist.findIndex((p) => p.toString() === product._id.toString());
  const added = index === -1;
  if (added) user.wishlist.push(product._id);
  else user.wishlist.splice(index, 1);

  await user.save();
  res.json({ success: true, data: { added, wishlist: user.wishlist } });
});
