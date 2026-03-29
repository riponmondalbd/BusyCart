import { Router } from "express";
import { refreshTokenHandler } from "../controller/refresh.controller";

const router = Router();

router.post("/refresh", refreshTokenHandler);

export default router;
