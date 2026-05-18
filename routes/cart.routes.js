import express from "express";
import { checkLogin } from "../middlewares/auth.middleware.js";
import {
  createCart,
  deleteCart,
  getAllCarts,
  updateFromUserCart,
} from "../controllers/cart.controller.js";
const router = express.Router();

router.post("/cart", checkLogin, createCart);
router.get("/carts", checkLogin, getAllCarts);
router.patch("/carts/quantity-update", checkLogin, updateFromUserCart);
router.delete(`/carts/cart/:slug`, checkLogin, deleteCart);
export default router;
