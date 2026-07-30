import { Schema, model, type Model, type Types } from "mongoose";
import { formatRef, nextSequence } from "./Counter";

export const QUOTE_STATUSES = ["new", "in_review", "quoted", "won", "lost"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export interface IQuoteItem {
  product?: Types.ObjectId;
  name: string;
  qty: number;
}

export interface IQuote {
  _id: Types.ObjectId;
  quoteNumber: string;
  /** Present when the request came from a signed-in customer. */
  user?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company: string;
  items: IQuoteItem[];
  message: string;
  status: QuoteStatus;
  quotedAmount?: number;
  adminNotes?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type QuoteModel = Model<IQuote>;

const quoteSchema = new Schema<IQuote, QuoteModel>(
  {
    quoteNumber: { type: String, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    phone: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    items: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: "Product" },
          name: { type: String, required: true },
          qty: { type: Number, default: 1, min: 1 },
          _id: false,
        },
      ],
      default: [],
    },
    message: { type: String, trim: true, maxlength: 4000, default: "" },
    status: { type: String, enum: QUOTE_STATUSES, default: "new", index: true },
    quotedAmount: { type: Number, min: 0 },
    adminNotes: { type: String, trim: true, maxlength: 4000 },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

quoteSchema.index({ createdAt: -1 });

quoteSchema.pre("save", async function assignQuoteNumber(next) {
  if (this.quoteNumber) return next();
  const year = new Date().getUTCFullYear();
  const seq = await nextSequence(`quote-${year}`);
  this.quoteNumber = formatRef("RFQ", year, seq);
  next();
});

export const Quote = model<IQuote, QuoteModel>("Quote", quoteSchema);
