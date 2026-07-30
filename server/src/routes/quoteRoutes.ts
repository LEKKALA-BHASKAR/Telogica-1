import { Router } from "express";
import * as quotes from "../controllers/quoteController";
import { optionalAuth, protect, restrictTo } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { objectIdParam, paginationQuery } from "../validators/common";
import { createQuoteBody, updateQuoteBody } from "../validators/commerce";

const router = Router();

// Open to guests — a quote request must not require an account.
router.post("/", optionalAuth, validate({ body: createQuoteBody }), quotes.createQuote);

router.get("/mine", protect, quotes.listMyQuotes);

router.get(
  "/admin/all",
  protect,
  restrictTo("admin"),
  validate({ query: paginationQuery }),
  quotes.adminListQuotes
);
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  validate({ params: objectIdParam, body: updateQuoteBody }),
  quotes.adminUpdateQuote
);

export default router;
