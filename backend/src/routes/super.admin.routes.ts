import { Router } from "express";

import {
  deleteUserBySuperAdmin,
  getAllAdmins,
  getAllUsers,
} from "../controller/super.admin.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get("/users", protect, authorize("SUPER_ADMIN"), getAllUsers);
router.get("/admins", protect, authorize("SUPER_ADMIN"), getAllAdmins);
router.delete(
  "/users/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteUserBySuperAdmin,
);

export default router;
