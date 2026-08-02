import { Schema, model, type Model, type Types } from "mongoose";

export const MESSAGE_STATUSES = ["new", "read", "replied", "archived"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export interface IMessage {
  _id: Types.ObjectId;
  name: string;
  /** Company or organisation the enquirer represents. Optional. */
  organisation: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  /** Set when the enquiry was raised from a product page. */
  productRef?: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

type MessageModel = Model<IMessage>;

const messageSchema = new Schema<IMessage, MessageModel>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 120 },
    organisation: { type: String, trim: true, default: "", maxlength: 160 },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    phone: { type: String, trim: true, default: "" },
    subject: { type: String, trim: true, default: "Sales Inquiry", maxlength: 160 },
    message: { type: String, required: [true, "Message is required"], trim: true, maxlength: 5000 },
    productRef: { type: String, trim: true },
    status: { type: String, enum: MESSAGE_STATUSES, default: "new", index: true },
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: -1 });

export const Message = model<IMessage, MessageModel>("Message", messageSchema);
