import { Router } from "express";
import { applyCoupon, createCoupon } from "../controller/coupon.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize";

const router = Router();

router.post(
  "/create",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  createCoupon,
);
router.post("/apply", protect, applyCoupon);

export default router;
