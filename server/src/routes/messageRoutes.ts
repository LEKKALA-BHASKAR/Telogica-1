import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as messages from "../controllers/messageController";
import { protect, restrictTo } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { objectIdParam, paginationQuery } from "../validators/common";
import { createMessageBody, updateMessageBody } from "../validators/commerce";

const router = Router();

// The contact form is public, so it gets a spam budget of its own.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "You've sent several messages already — please email sales@telogica.com" },
});

router.post("/", contactLimiter, validate({ body: createMessageBody }), messages.createMessage);

router.get(
  "/admin/all",
  protect,
  restrictTo("admin"),
  validate({ query: paginationQuery }),
  messages.adminListMessages
);
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  validate({ params: objectIdParam, body: updateMessageBody }),
  messages.adminUpdateMessage
);

export default router;
