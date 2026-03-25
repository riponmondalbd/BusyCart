import { Router } from "express";

import { deleteUserByAdmin } from "../controller/admin.controller";
import { getAllUsers } from "../controller/super.admin.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get("/users", protect, authorize("ADMIN"), getAllUsers);
router.delete("/users/:id", protect, authorize("ADMIN"), deleteUserByAdmin);

export default router;
