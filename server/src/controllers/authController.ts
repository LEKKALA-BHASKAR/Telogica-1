import crypto from "crypto";
import type { Request, Response } from "express";
import { env } from "../config/env";
import { User, type IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendMail } from "../utils/mailer";
import { clearAuthCookie, sendAuthCookie, signToken } from "../utils/token";
import type { HydratedDocument } from "mongoose";

/** The user shape returned to the client — never includes the password hash. */
function publicUser(user: HydratedDocument<IUser>) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    company: user.company ?? "",
    role: user.role,
    addresses: user.addresses,
    wishlist: user.wishlist,
    createdAt: user.createdAt,
  };
}

function issueSession(res: Response, user: HydratedDocument<IUser>, statusCode = 200) {
  const token = signToken({ id: user._id.toString(), role: user.role });
  sendAuthCookie(res, token);
  res.status(statusCode).json({ success: true, data: { user: publicUser(user), token } });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, company } = req.body;

  if (await User.exists({ email })) {
    throw ApiError.conflict("An account with that email already exists");
  }

  const user = await User.create({ name, email, password, phone, company });
  await sendMail({
    to: user.email,
    subject: "Welcome to Telogica",
    text: `Hi ${user.name},\n\nYour Telogica account is ready. You can now track orders, save addresses and request quotes from ${env.CLIENT_URL}.\n\n— Telogica Limited`,
  });

  issueSession(res, user, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  // A single message for both cases so the endpoint can't enumerate accounts.
  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized("Email or password is incorrect");
  }
  if (!user.isActive) {
    throw ApiError.forbidden("This account has been disabled. Contact support@telogica.com");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  issueSession(res, user);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ success: true, message: "Signed out" });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: { user: publicUser(req.user!) } });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const { name, phone, company } = req.body;
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (company !== undefined) user.company = company;
  await user.save();
  res.json({ success: true, data: { user: publicUser(user) } });
});

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user!._id).select("+password");
  if (!user || !(await user.matchPassword(currentPassword))) {
    throw ApiError.unauthorized("Your current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  issueSession(res, user);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  // Always answer identically, so the endpoint reveals nothing about the inbox.
  if (user) {
    const rawToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
    await sendMail({
      to: user.email,
      subject: "Reset your Telogica password",
      text: `Hi ${user.name},\n\nUse the link below to choose a new password. It expires in 30 minutes.\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.\n\n— Telogica Limited`,
    });
  }

  res.json({
    success: true,
    message: "If that email is registered, a reset link is on its way.",
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const hashed = crypto.createHash("sha256").update(req.body.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: new Date() },
  }).select("+password");

  if (!user) throw ApiError.badRequest("That reset link is invalid or has expired");

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  issueSession(res, user);
});

export { publicUser };
