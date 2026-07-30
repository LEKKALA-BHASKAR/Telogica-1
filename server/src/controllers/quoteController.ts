import type { Request, Response } from "express";
import { env } from "../config/env";
import { Product } from "../models/Product";
import { Quote, type IQuoteItem } from "../models/Quote";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendMail } from "../utils/mailer";
import { buildMeta, getPagination } from "../utils/query";

/**
 * Request-for-quote intake. Works signed in or out — quote-only lines such as
 * the RF amplifier range never enter the cart, they land here instead.
 */
export const createQuote = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, company, message, items = [] } = req.body;

  const resolved: IQuoteItem[] = [];
  for (const line of items as { productId?: string; name?: string; qty?: number }[]) {
    if (line.productId) {
      const product = await Product.findById(line.productId).select("name");
      if (product) {
        resolved.push({ product: product._id, name: product.name, qty: line.qty ?? 1 });
        continue;
      }
    }
    if (line.name) resolved.push({ name: line.name, qty: line.qty ?? 1 });
  }

  const quote = await Quote.create({
    user: req.user?._id,
    name,
    email,
    phone,
    company,
    message,
    items: resolved,
  });

  const lineSummary = resolved.length
    ? resolved.map((i) => `  • ${i.name} × ${i.qty}`).join("\n")
    : "  (no specific product selected)";

  await Promise.all([
    sendMail({
      to: email,
      subject: `We've received your quote request ${quote.quoteNumber}`,
      text: `Hi ${name},\n\nThanks for your enquiry. Our team will respond within one business day.\n\nReference: ${quote.quoteNumber}\n\nItems:\n${lineSummary}\n\n— Telogica Limited`,
    }),
    sendMail({
      to: env.ADMIN_EMAIL,
      subject: `New quote request ${quote.quoteNumber} from ${name}`,
      text: `${name} (${email}${phone ? `, ${phone}` : ""})${company ? ` — ${company}` : ""}\n\nItems:\n${lineSummary}\n\nMessage:\n${message || "(none)"}\n\nManage it at ${env.CLIENT_URL}/admin/quotes`,
    }),
  ]);

  res.status(201).json({ success: true, data: { quote } });
});

export const listMyQuotes = asyncHandler(async (req: Request, res: Response) => {
  const items = await Quote.find({
    $or: [{ user: req.user!._id }, { email: req.user!.email }],
  })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data: { items } });
});

/* ── Admin ─────────────────────────────────────────────────────────────── */

export const adminListQuotes = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req.query as Record<string, unknown>, 20);
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const rx = new RegExp(String(req.query.q).trim(), "i");
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }, { quoteNumber: rx }];
  }

  const [items, total] = await Promise.all([
    Quote.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).lean(),
    Quote.countDocuments(filter),
  ]);

  res.json({ success: true, data: { items }, meta: buildMeta(total, pagination) });
});

export const adminUpdateQuote = asyncHandler(async (req: Request, res: Response) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) throw ApiError.notFound("Quote request not found");

  const { status, quotedAmount, adminNotes } = req.body;
  if (status) quote.status = status;
  if (quotedAmount !== undefined) quote.quotedAmount = quotedAmount;
  if (adminNotes !== undefined) quote.adminNotes = adminNotes;
  if (status === "quoted") quote.respondedAt = new Date();

  await quote.save();

  if (status === "quoted" && quote.quotedAmount) {
    await sendMail({
      to: quote.email,
      subject: `Your Telogica quote ${quote.quoteNumber}`,
      text: `Hi ${quote.name},\n\nWe've priced your request ${quote.quoteNumber} at ${
        env.CURRENCY
      } ${quote.quotedAmount.toLocaleString("en-IN")}.\n\n${
        quote.adminNotes ?? ""
      }\n\nReply to this email to proceed.\n\n— Telogica Limited`,
    });
  }

  res.json({ success: true, data: { quote } });
});
