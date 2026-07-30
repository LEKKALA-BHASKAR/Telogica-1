import { Schema, model, type Model, type Types } from "mongoose";
import { addressSchema, type IAddress } from "./User";
import { formatRef, nextSequence } from "./Counter";

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["razorpay", "cod", "mock"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  slug: string;
  image: string;
  sku: string;
  price: number;
  qty: number;
}

export interface IOrder {
  _id: Types.ObjectId;
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: PaymentMethod;
  paymentResult?: {
    id?: string;
    orderId?: string;
    signature?: string;
    status?: string;
    email?: string;
    updatedAt?: Date;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  currency: string;
  isPaid: boolean;
  paidAt?: Date;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: Date; note?: string }[];
  trackingNumber?: string;
  courier?: string;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  customerNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

type OrderModel = Model<IOrder>;

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, default: "" },
    sku: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder, OrderModel>(
  {
    orderNumber: { type: String, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: "An order needs at least one item",
      },
    },
    shippingAddress: { type: addressSchema, required: true },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    paymentResult: {
      id: String,
      orderId: String,
      signature: String,
      status: String,
      email: String,
      updatedAt: Date,
    },
    itemsPrice: { type: Number, required: true, min: 0 },
    taxPrice: { type: Number, required: true, min: 0 },
    shippingPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    statusHistory: {
      type: [
        {
          status: { type: String, enum: ORDER_STATUSES, required: true },
          at: { type: Date, default: Date.now },
          note: String,
          _id: false,
        },
      ],
      default: [],
    },
    trackingNumber: { type: String, trim: true },
    courier: { type: String, trim: true },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String, trim: true },
    customerNote: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

orderSchema.pre("save", async function assignOrderNumber(next) {
  if (this.orderNumber) return next();
  const year = new Date().getUTCFullYear();
  const seq = await nextSequence(`order-${year}`);
  this.orderNumber = formatRef("TLG", year, seq);
  if (!this.statusHistory.length) {
    this.statusHistory.push({ status: this.status, at: new Date(), note: "Order placed" });
  }
  next();
});

export const Order = model<IOrder, OrderModel>("Order", orderSchema);
