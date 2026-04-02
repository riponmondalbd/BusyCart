import { Router } from "express";
import {
  getRevenueAnalytics,
  getTopProducts,
} from "../controller/analytics.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get(
  "/top-products",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  getTopProducts,
);
router.get(
  "/revenue",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  getRevenueAnalytics,
);

export default router;
