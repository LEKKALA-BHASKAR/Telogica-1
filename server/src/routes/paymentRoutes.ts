import { Router } from "express";
import * as payment from "../controllers/paymentController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { paymentOrderBody, verifyPaymentBody } from "../validators/commerce";

const router = Router();

router.get("/config", payment.getPaymentConfig);

router.use(protect);

router.post(
  "/razorpay/order",
  validate({ body: paymentOrderBody }),
  payment.createRazorpayOrder
);
router.post(
  "/razorpay/verify",
  validate({ body: verifyPaymentBody }),
  payment.verifyRazorpayPayment
);
router.post("/mock/pay", validate({ body: paymentOrderBody }), payment.payWithMockGateway);

export default router;
