import { Router } from "express";
import * as orders from "../controllers/orderController";
import { markOrderPaidManually } from "../controllers/paymentController";
import { protect, restrictTo } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { objectIdParam, paginationQuery } from "../validators/common";
import {
  cancelOrderBody,
  createOrderBody,
  manualPaymentBody,
  updateOrderStatusBody,
} from "../validators/commerce";

const router = Router();

router.use(protect);

router.post("/", validate({ body: createOrderBody }), orders.createOrder);
router.get("/mine", validate({ query: paginationQuery }), orders.listMyOrders);

const admin = [restrictTo("admin")] as const;

router.get("/admin/all", ...admin, orders.adminListOrders);
router.patch(
  "/:id/status",
  ...admin,
  validate({ params: objectIdParam, body: updateOrderStatusBody }),
  orders.updateOrderStatus
);
router.patch(
  "/:id/mark-paid",
  ...admin,
  validate({ params: objectIdParam, body: manualPaymentBody }),
  markOrderPaidManually
);

router.get("/:id", validate({ params: objectIdParam }), orders.getOrder);
router.patch(
  "/:id/cancel",
  validate({ params: objectIdParam, body: cancelOrderBody }),
  orders.cancelOrder
);

export default router;
