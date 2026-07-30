import { Schema, model, type Model, type Types } from "mongoose";
import { Product } from "./Product";

export interface IReview {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  rating: number;
  title: string;
  comment: string;
  /** Set when the reviewer has a delivered order containing this product. */
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewModel extends Model<IReview> {
  recalculateProductRating(productId: Types.ObjectId): Promise<void>;
}

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: {
      type: Number,
      required: [true, "A rating is required"],
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    title: { type: String, trim: true, maxlength: 120, default: "" },
    comment: { type: String, required: [true, "A comment is required"], trim: true, maxlength: 2000 },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per customer per product; updates edit the existing document.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.static(
  "recalculateProductRating",
  async function recalculateProductRating(productId: Types.ObjectId) {
    const [stats] = await this.aggregate<{ avg: number; count: number }>([
      { $match: { product: productId } },
      { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(productId, {
      rating: stats ? Math.round(stats.avg * 10) / 10 : 0,
      numReviews: stats ? stats.count : 0,
    });
  }
);

reviewSchema.post("save", async function afterSave() {
  await (this.constructor as ReviewModel).recalculateProductRating(this.product);
});

reviewSchema.post("findOneAndDelete", async function afterDelete(doc: IReview | null) {
  if (doc) await (model("Review") as ReviewModel).recalculateProductRating(doc.product);
});

export const Review = model<IReview, ReviewModel>("Review", reviewSchema);
