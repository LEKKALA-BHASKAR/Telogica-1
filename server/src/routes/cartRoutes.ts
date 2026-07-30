import { Router } from "express";
import * as cart from "../controllers/cartController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  addToCartBody,
  cartItemParams,
  mergeCartBody,
  updateCartItemBody,
} from "../validators/commerce";

const router = Router();

router.use(protect);

router.route("/").get(cart.getCart).delete(cart.clearCart);

router.post("/items", validate({ body: addToCartBody }), cart.addToCart);
router.post("/merge", validate({ body: mergeCartBody }), cart.mergeCart);

router
  .route("/items/:productId")
  .patch(validate({ params: cartItemParams, body: updateCartItemBody }), cart.updateCartItem)
  .delete(validate({ params: cartItemParams }), cart.removeCartItem);

export default router;
