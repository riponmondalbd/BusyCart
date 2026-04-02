import { Router } from "express";
import { simulatePayment } from "../controller/payment.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/simulate", protect, simulatePayment);

export default router;
