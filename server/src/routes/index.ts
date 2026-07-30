import { Router } from "express";
import { env } from "../config/env";
import { storefrontConfig } from "../utils/pricing";
import adminRoutes from "./adminRoutes";
import authRoutes from "./authRoutes";
import cartRoutes from "./cartRoutes";
import messageRoutes from "./messageRoutes";
import orderRoutes from "./orderRoutes";
import paymentRoutes from "./paymentRoutes";
import productRoutes from "./productRoutes";
import quoteRoutes from "./quoteRoutes";
import reviewRoutes from "./reviewRoutes";
import userRoutes from "./userRoutes";

const router = Router();

/** Tax, shipping and gateway settings the storefront needs before checkout. */
router.get("/config", (_req, res) => {
  res.json({
    success: true,
    data: {
      ...storefrontConfig,
      paymentProvider: env.razorpayEnabled ? "razorpay" : "mock",
      razorpayKeyId: env.razorpayEnabled ? env.RAZORPAY_KEY_ID : "",
    },
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/quotes", quoteRoutes);
router.use("/messages", messageRoutes);
router.use("/admin", adminRoutes);

export default router;
