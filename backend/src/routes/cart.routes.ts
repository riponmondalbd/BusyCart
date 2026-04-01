import { Router } from "express";
import {
  addToCart,
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "../controller/cart.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/my-cart", protect, getMyCart);
router.post("/add", protect, addToCart);
router.put("/update/:itemId", protect, updateCartItem);
router.delete("/remove/:itemId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;
