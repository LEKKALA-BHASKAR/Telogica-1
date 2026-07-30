import { Router } from "express";
import { deleteReview, listMyReviews } from "../controllers/reviewController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { objectIdParam } from "../validators/common";

const router = Router();

router.use(protect);

router.get("/mine", listMyReviews);
router.delete("/:id", validate({ params: objectIdParam }), deleteReview);

export default router;
