import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as auth from "../controllers/authController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  forgotPasswordBody,
  loginBody,
  registerBody,
  resetPasswordBody,
  updatePasswordBody,
  updateProfileBody,
} from "../validators/auth";

const router = Router();

// Credential endpoints get their own tighter budget than the global limiter.
const credentialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts — please try again in 15 minutes" },
});

router.post("/register", credentialLimiter, validate({ body: registerBody }), auth.register);
router.post("/login", credentialLimiter, validate({ body: loginBody }), auth.login);
router.post("/logout", auth.logout);
router.post(
  "/forgot-password",
  credentialLimiter,
  validate({ body: forgotPasswordBody }),
  auth.forgotPassword
);
router.post(
  "/reset-password",
  credentialLimiter,
  validate({ body: resetPasswordBody }),
  auth.resetPassword
);

router.get("/me", protect, auth.getMe);
router.patch("/me", protect, validate({ body: updateProfileBody }), auth.updateProfile);
router.patch(
  "/me/password",
  protect,
  validate({ body: updatePasswordBody }),
  auth.updatePassword
);

export default router;
