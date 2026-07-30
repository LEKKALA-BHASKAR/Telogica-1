import type { Request, Response } from "express";
import type { Types } from "mongoose";
import { Cart } from "../models/Cart";
import { Product, type IProduct } from "../models/Product";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { calculateTotals, storefrontConfig } from "../utils/pricing";

export const MAX_QTY_PER_LINE = 20;

export interface SerializedCartLine {
  product: string;
  slug: string;
  name: string;
  image: string;
  sku: string;
  price: number;
  mrp: number;
  qty: number;
  stock: number;
  lineTotal: number;
  /** Set when the live price moved after the item was added. */
  priceChangedFrom?: number;
  outOfStock: boolean;
  qtyAdjusted: boolean;
}

/**
 * Reads the cart, drops products that have since been archived, clamps
 * quantities to available stock and re-prices every line from the catalogue.
 * Persists any correction so the stored cart and the response never disagree.
 */
export async function loadCart(userId: Types.ObjectId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    return { lines: [] as SerializedCartLine[], totals: calculateTotals([]), removed: [] as string[] };
  }

  const products = await Product.find({
    _id: { $in: cart.items.map((i) => i.product) },
  }).lean<IProduct[]>();
  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  const lines: SerializedCartLine[] = [];
  const removed: string[] = [];
  let mutated = false;

  for (const item of [...cart.items]) {
    const product = byId.get(item.product.toString());

    // Archived or turned quote-only since it was added — it can't be checked out.
    if (!product || !product.isActive || product.requiresQuote) {
      removed.push(product?.name ?? "An item");
      cart.items = cart.items.filter((i) => i.product.toString() !== item.product.toString());
      mutated = true;
      continue;
    }

    const qty = Math.max(0, Math.min(item.qty, product.stock, MAX_QTY_PER_LINE));
    if (qty === 0) {
      lines.push({
        product: product._id.toString(),
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? "",
        sku: product.sku,
        price: product.price,
        mrp: product.mrp,
        qty: 0,
        stock: 0,
        lineTotal: 0,
        outOfStock: true,
        qtyAdjusted: item.qty !== 0,
      });
      continue;
    }

    if (qty !== item.qty) {
      const stored = cart.items.find((i) => i.product.toString() === item.product.toString());
      if (stored) stored.qty = qty;
      mutated = true;
    }

    lines.push({
      product: product._id.toString(),
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      sku: product.sku,
      price: product.price,
      mrp: product.mrp,
      qty,
      stock: product.stock,
      lineTotal: Math.round(product.price * qty * 100) / 100,
      priceChangedFrom: item.priceAtAdd !== product.price ? item.priceAtAdd : undefined,
      outOfStock: false,
      qtyAdjusted: qty !== item.qty,
    });
  }

  if (mutated) await cart.save();

  const totals = calculateTotals(
    lines.filter((l) => !l.outOfStock).map((l) => ({ price: l.price, qty: l.qty }))
  );
  return { lines, totals, removed };
}

function respond(res: Response, payload: Awaited<ReturnType<typeof loadCart>>, status = 200) {
  res.status(status).json({
    success: true,
    data: {
      items: payload.lines,
      totals: payload.totals,
      config: storefrontConfig,
      ...(payload.removed.length ? { removed: payload.removed } : {}),
    },
  });
}

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  respond(res, await loadCart(req.user!._id));
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, qty } = req.body as { productId: string; qty: number };

  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw ApiError.notFound("That product is no longer available");
  if (product.requiresQuote) {
    throw ApiError.badRequest("This product is supplied on a quotation basis — request a quote instead");
  }
  if (product.stock < 1) throw ApiError.badRequest("That product is out of stock");

  const cart = (await Cart.findOne({ user: req.user!._id })) ?? new Cart({ user: req.user!._id, items: [] });
  const existing = cart.items.find((i) => i.product.toString() === product._id.toString());
  const desired = (existing?.qty ?? 0) + qty;

  if (desired > product.stock) {
    throw ApiError.badRequest(
      `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} of ${product.name} are in stock`
    );
  }
  if (desired > MAX_QTY_PER_LINE) {
    throw ApiError.badRequest(
      `You can order up to ${MAX_QTY_PER_LINE} units per line — contact sales for larger volumes`
    );
  }

  if (existing) existing.qty = desired;
  else cart.items.push({ product: product._id, qty, priceAtAdd: product.price });

  await cart.save();
  respond(res, await loadCart(req.user!._id), 201);
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { qty } = req.body as { qty: number };
  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) throw ApiError.notFound("Your cart is empty");

  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) throw ApiError.notFound("That item is not in your cart");

  if (qty === 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    const product = await Product.findById(req.params.productId).select("stock name");
    if (!product) throw ApiError.notFound("That product is no longer available");
    if (qty > product.stock) {
      throw ApiError.badRequest(
        `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} of ${product.name} are in stock`
      );
    }
    item.qty = qty;
  }

  await cart.save();
  respond(res, await loadCart(req.user!._id));
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id });
  if (cart) {
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
  }
  respond(res, await loadCart(req.user!._id));
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  await Cart.findOneAndUpdate({ user: req.user!._id }, { items: [] }, { upsert: true });
  respond(res, await loadCart(req.user!._id));
});

/**
 * Folds a guest (localStorage) cart into the account cart at sign-in.
 * Quantities are summed, then clamped by the usual stock rules.
 */
export const mergeCart = asyncHandler(async (req: Request, res: Response) => {
  const incoming = (req.body.items ?? []) as { productId: string; qty: number }[];
  if (!incoming.length) {
    respond(res, await loadCart(req.user!._id));
    return;
  }

  const products = await Product.find({
    _id: { $in: incoming.map((i) => i.productId) },
    isActive: true,
    requiresQuote: false,
  }).select("_id price stock");
  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  const cart = (await Cart.findOne({ user: req.user!._id })) ?? new Cart({ user: req.user!._id, items: [] });

  for (const line of incoming) {
    const product = byId.get(line.productId);
    if (!product || product.stock < 1) continue;

    const existing = cart.items.find((i) => i.product.toString() === product._id.toString());
    const merged = Math.min((existing?.qty ?? 0) + line.qty, product.stock, MAX_QTY_PER_LINE);
    if (existing) existing.qty = merged;
    else cart.items.push({ product: product._id, qty: merged, priceAtAdd: product.price });
  }

  await cart.save();
  respond(res, await loadCart(req.user!._id));
});
