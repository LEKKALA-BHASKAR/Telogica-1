import { Router } from "express";
import * as user from "../controllers/userController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { addressInput, objectIdParam } from "../validators/common";

const router = Router();

router.use(protect);

router
  .route("/addresses")
  .get(user.listAddresses)
  .post(validate({ body: addressInput }), user.addAddress);

router
  .route("/addresses/:id")
  .patch(
    validate({ params: objectIdParam, body: addressInput.partial() }),
    user.updateAddress
  )
  .delete(validate({ params: objectIdParam }), user.deleteAddress);

router.get("/wishlist", user.getWishlist);
router.post("/wishlist/:id", validate({ params: objectIdParam }), user.toggleWishlist);

export default router;
