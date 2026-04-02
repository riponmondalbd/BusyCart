import { Router } from "express";
import {
  getAllRefunds,
  getMyRefunds,
  refundOrder,
} from "../controller/refund.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize";

const router = Router();

router.post("/", protect, authorize("ADMIN", "SUPER_ADMIN"), refundOrder);
router.get(
  "/get-all-refunds",
  protect,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAllRefunds,
);
router.get("/my-refunds", protect, getMyRefunds);

export default router;
