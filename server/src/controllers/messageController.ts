import type { Request, Response } from "express";
import { env } from "../config/env";
import { Message } from "../models/Message";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendMail } from "../utils/mailer";
import { buildMeta, getPagination } from "../utils/query";

/** Contact-form intake — replaces the old mailto: hand-off. */
export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await Message.create(req.body);

  await Promise.all([
    sendMail({
      to: message.email,
      subject: "Thanks for contacting Telogica",
      text: `Hi ${message.name},\n\nWe've received your message and will respond within 24 hours.\n\n— Telogica Limited`,
    }),
    sendMail({
      to: env.ADMIN_EMAIL,
      subject: `[${message.subject}] ${message.name}`,
      text: `${message.name} (${message.email}${message.phone ? `, ${message.phone}` : ""})${
        message.productRef ? `\nProduct: ${message.productRef}` : ""
      }\n\n${message.message}\n\nInbox: ${env.CLIENT_URL}/admin/messages`,
    }),
  ]);

  res.status(201).json({
    success: true,
    message: "Thanks — we'll be in touch within 24 hours.",
    data: { id: message._id },
  });
});

export const adminListMessages = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query as Record<string, unknown>, 20);
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    Message.countDocuments(filter),
  ]);

  res.json({ success: true, data: { items }, meta: buildMeta(total, pagination) });
});

export const adminUpdateMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!message) throw ApiError.notFound("Message not found");
  res.json({ success: true, data: { message } });
});
