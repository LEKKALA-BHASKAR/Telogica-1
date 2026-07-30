import type { Request, Response } from "express";
import { isValidObjectId, type FilterQuery } from "mongoose";
import { Product, type IProduct } from "../models/Product";
import { Review } from "../models/Review";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildMeta, escapeRegex, getPagination, resolveSort } from "../utils/query";
import { UPLOAD_URL_PREFIX } from "../middleware/upload";

const SORTS: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1, numReviews: -1 },
  name: { name: 1 },
  popular: { soldCount: -1, rating: -1 },
  relevance: { isFeatured: -1, soldCount: -1, name: 1 },
};

const LIST_FIELDS =
  "name slug sku category sectors images price mrp stock requiresQuote rating numReviews warrantyMonths shortDescription isFeatured isActive legacyId createdAt";

/**
 * Products are addressable by slug (canonical), by the id carried over from the
 * old static catalogue, or by Mongo id — so previously shared links never 404.
 */
export async function findProductByKey(key: string, includeInactive = false) {
  const conditions: FilterQuery<IProduct>[] = [{ slug: key }, { legacyId: key }];
  if (isValidObjectId(key)) conditions.push({ _id: key });

  const filter: FilterQuery<IProduct> = { $or: conditions };
  if (!includeInactive) filter.isActive = true;

  return Product.findOne(filter);
}

function buildFilter(query: Record<string, unknown>, includeInactive = false): FilterQuery<IProduct> {
  const filter: FilterQuery<IProduct> = {};
  if (!includeInactive) filter.isActive = true;

  if (query.category) filter.category = query.category as string;
  if (query.sector) filter.sectors = query.sector as string;
  if (query.featured) filter.isFeatured = true;
  if (query.inStock) filter.stock = { $gt: 0 };
  if (query.buyable) filter.requiresQuote = false;
  if (typeof query.minRating === "number") filter.rating = { $gte: query.minRating };

  const min = query.minPrice as number | undefined;
  const max = query.maxPrice as number | undefined;
  const priceRange: Record<string, number> = {};
  if (min !== undefined) priceRange.$gte = min;
  if (max !== undefined) priceRange.$lte = max;
  if (Object.keys(priceRange).length) filter.price = priceRange;

  const q = (query.q as string | undefined)?.trim();
  if (q) {
    // Regex rather than $text: buyers search partial model numbers like "321".
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ name: rx }, { sku: rx }, { tags: rx }, { description: rx }];
  }

  return filter;
}

/* ── Public ────────────────────────────────────────────────────────────── */

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query as Record<string, unknown>, 12);
  const filter = buildFilter(req.query as Record<string, unknown>);
  const sort = resolveSort(req.query.sort, SORTS, "relevance");

  const [items, total] = await Promise.all([
    Product.find(filter).select(LIST_FIELDS).sort(sort).skip(pagination.skip).limit(pagination.limit).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, data: { items }, meta: buildMeta(total, pagination) });
});

/** Filter metadata for the catalogue sidebar — counts per sector and price bounds. */
export const getFacets = asyncHandler(async (_req: Request, res: Response) => {
  const [bySector, priceRange, totals] = await Promise.all([
    Product.aggregate<{ _id: string; count: number }>([
      { $match: { isActive: true } },
      { $unwind: "$sectors" },
      { $group: { _id: "$sectors", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Product.aggregate<{ _id: null; min: number; max: number }>([
      { $match: { isActive: true, requiresQuote: false, price: { $gt: 0 } } },
      { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
    ]),
    Product.aggregate<{ _id: null; total: number; buyable: number; quoteOnly: number }>([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          buyable: { $sum: { $cond: ["$requiresQuote", 0, 1] } },
          quoteOnly: { $sum: { $cond: ["$requiresQuote", 1, 0] } },
        },
      },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      sectors: bySector.map((s) => ({ name: s._id, count: s.count })),
      priceRange: { min: priceRange[0]?.min ?? 0, max: priceRange[0]?.max ?? 0 },
      counts: {
        total: totals[0]?.total ?? 0,
        buyable: totals[0]?.buyable ?? 0,
        quoteOnly: totals[0]?.quoteOnly ?? 0,
      },
    },
  });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.user?.role === "admin";
  const product = await findProductByKey(req.params.key, includeInactive);
  if (!product) throw ApiError.notFound("We couldn't find that product");

  const related = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    sectors: { $in: product.sectors },
  })
    .select(LIST_FIELDS)
    .sort({ isFeatured: -1, rating: -1 })
    .limit(4)
    .lean();

  res.json({ success: true, data: { product, related } });
});

export const getFeatured = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Product.find({ isActive: true, isFeatured: true })
    .select(LIST_FIELDS)
    .sort({ soldCount: -1, rating: -1 })
    .limit(8)
    .lean();
  res.json({ success: true, data: { items } });
});

/* ── Admin ─────────────────────────────────────────────────────────────── */

export const adminListProducts = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query as Record<string, unknown>, 20);
  const filter = buildFilter(req.query as Record<string, unknown>, true);
  const sort = resolveSort(req.query.sort, SORTS, "newest");

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(pagination.skip).limit(pagination.limit).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, data: { items }, meta: buildMeta(total, pagination) });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const sku = String(req.body.sku).toUpperCase();
  if (await Product.exists({ sku })) throw ApiError.conflict(`SKU ${sku} is already in use`);

  const product = await Product.create({ ...req.body, sku });
  res.status(201).json({ success: true, data: { product } });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound("Product not found");

  if (req.body.sku) {
    const sku = String(req.body.sku).toUpperCase();
    if (await Product.exists({ sku, _id: { $ne: product._id } })) {
      throw ApiError.conflict(`SKU ${sku} is already in use`);
    }
    req.body.sku = sku;
  }

  Object.assign(product, req.body);
  await product.save();
  res.json({ success: true, data: { product } });
});

/**
 * Soft delete by default: orders reference products, so removing the document
 * would orphan history. `?hard=true` is available for seed/demo cleanup.
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound("Product not found");

  if (req.query.hard === "true") {
    await Promise.all([product.deleteOne(), Review.deleteMany({ product: product._id })]);
    res.json({ success: true, message: "Product permanently deleted" });
    return;
  }

  product.isActive = false;
  await product.save();
  res.json({ success: true, message: "Product archived and hidden from the storefront" });
});

export const uploadProductImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (!files.length) throw ApiError.badRequest("Choose at least one image to upload");
  const urls = files.map((f) => `${UPLOAD_URL_PREFIX}/${f.filename}`);
  res.status(201).json({ success: true, data: { urls } });
});
