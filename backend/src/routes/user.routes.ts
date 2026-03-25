import express from "express";
import {
  getProfile,
  updatePassword,
  updateProfilePhoto,
  updateUserProfile,
} from "../controller/user.controller";
import { protect } from "../middleware/auth.middleware";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/password", protect, updatePassword);
router.put("/photo", protect, upload.single("image"), updateProfilePhoto);

export default router;
