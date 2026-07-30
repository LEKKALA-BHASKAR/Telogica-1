import { Schema, model, type Model, type Types } from "mongoose";
import slugify from "slugify";

export const CATEGORIES = ["Telecommunication", "Railway", "Defence"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface ISpec {
  key: string;
  value: string;
}

export interface IProduct {
  _id: Types.ObjectId;
  /** Identifier carried over from the static catalogue, so old /products/<id> links keep working. */
  legacyId?: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: Category;
  sectors: Category[];
  description: string;
  shortDescription: string;
  images: string[];
  features: string[];
  specs: ISpec[];
  tags: string[];
  /** Selling price in INR. Zero is only valid on a quote-only product. */
  price: number;
  /** List price used to render a strike-through and a discount badge. */
  mrp: number;
  stock: number;
  warrantyMonths: number | null;
  /** Quote-only lines (defence RF, bespoke systems) bypass the cart entirely. */
  requiresQuote: boolean;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  numReviews: number;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

type ProductModel = Model<IProduct>;

const productSchema = new Schema<IProduct, ProductModel>(
  {
    legacyId: { type: String, index: true, sparse: true },
    name: { type: String, required: [true, "Product name is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    brand: { type: String, default: "Telogica", trim: true },
    category: { type: String, enum: CATEGORIES, required: true },
    sectors: {
      type: [{ type: String, enum: CATEGORIES }],
      default: [],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "A product must serve at least one sector",
      },
    },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "", maxlength: 400 },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    specs: {
      type: [{ key: { type: String, required: true }, value: { type: String, required: true } }],
      default: [],
    },
    tags: { type: [String], default: [], index: true },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function (this: IProduct, v: number) {
          return this.requiresQuote || v > 0;
        },
        message: "A purchasable product needs a price above zero",
      },
    },
    mrp: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: [0, "Stock cannot be negative"] },
    warrantyMonths: { type: Number, default: null },
    requiresQuote: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Weighted text search across the fields buyers actually type into.
productSchema.index(
  { name: "text", description: "text", tags: "text", sku: "text" },
  { weights: { name: 10, sku: 8, tags: 4, description: 1 }, name: "product_search" }
);
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });

productSchema.virtual("inStock").get(function () {
  return this.requiresQuote || this.stock > 0;
});

productSchema.virtual("discountPercent").get(function () {
  if (!this.mrp || !this.price || this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.pre("validate", async function ensureSlug(next) {
  if (this.slug && !this.isModified("name")) return next();
  const base = slugify(this.name.replace(/\s+/g, " ").trim(), { lower: true, strict: true }).slice(
    0,
    80
  );
  let candidate = base || "product";
  let suffix = 2;
  const Model = this.constructor as ProductModel;
  // Slugs are user-visible URLs, so collisions get a numeric suffix rather than an error.
  while (await Model.exists({ slug: candidate, _id: { $ne: this._id } })) {
    candidate = `${base}-${suffix++}`;
  }
  this.slug = candidate;
  next();
});

export const Product = model<IProduct, ProductModel>("Product", productSchema);
