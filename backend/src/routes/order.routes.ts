import { Router } from "express";
import { createOrder, getMyOrders } from "../controller/order.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

export default router;
