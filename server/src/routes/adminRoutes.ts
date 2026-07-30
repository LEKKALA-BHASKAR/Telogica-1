import { Router } from "express";
import * as admin from "../controllers/adminController";
import { listMyReviews, deleteReview } from "../controllers/reviewController";
import { protect, restrictTo } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { objectIdParam, paginationQuery } from "../validators/common";
import { updateUserBody } from "../validators/commerce";

const router = Router();

router.use(protect, restrictTo("admin"));

router.get("/dashboard", admin.getDashboard);
router.get("/users", validate({ query: paginationQuery }), admin.listUsers);
router.patch(
  "/users/:id",
  validate({ params: objectIdParam, body: updateUserBody }),
  admin.updateUser
);
router.delete("/reviews/:id", validate({ params: objectIdParam }), deleteReview);

// Kept here so the admin panel can audit a moderator's own reviews too.
router.get("/reviews/mine", listMyReviews);

export default router;
