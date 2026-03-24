import { Router } from "express";
import authRoutes from "./auth.routes";
import googleAuthRoutes from "./googleAuth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/auth", googleAuthRoutes);

export default router;
