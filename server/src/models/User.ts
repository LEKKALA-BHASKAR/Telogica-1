import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Schema, model, type Model, type Types } from "mongoose";

export interface IAddress {
  _id?: Types.ObjectId;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
  role: "user" | "admin";
  addresses: IAddress[];
  wishlist: Types.ObjectId[];
  isActive: boolean;
  lastLoginAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  matchPassword(entered: string): Promise<boolean>;
  createPasswordResetToken(): string;
}

type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

export const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, trim: true, default: "Home" },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    phone: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: { type: [addressSchema], default: [] },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Exactly one default address, and always at least one once addresses exist.
userSchema.pre("save", function normaliseAddresses(next) {
  if (this.isModified("addresses") && this.addresses.length) {
    const defaults = this.addresses.filter((a) => a.isDefault);
    if (defaults.length === 0) {
      this.addresses[0].isDefault = true;
    } else if (defaults.length > 1) {
      let seen = false;
      this.addresses.forEach((a) => {
        if (a.isDefault && seen) a.isDefault = false;
        else if (a.isDefault) seen = true;
      });
    }
  }
  next();
});

userSchema.method("matchPassword", function matchPassword(entered: string) {
  return bcrypt.compare(entered, this.password);
});

userSchema.method("createPasswordResetToken", function createPasswordResetToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(raw).digest("hex");
  this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);
  return raw;
});

export const User = model<IUser, UserModel>("User", userSchema);
