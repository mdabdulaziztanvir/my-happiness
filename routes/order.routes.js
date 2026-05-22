import express from "express";
import {
  createOrder,
  getAllOrder,
  gellAllOrderAccordingtoUser,
  getSingleOrderByUser,
  getSingleOrderByUserForAdmin,
} from "../controllers/order.controller.js";
import { adminCheck, checkLogin } from "../middlewares/auth.middleware.js";
const router = express.Router();
// user
router.post("/create-order", checkLogin, createOrder);
router.get("/orders", checkLogin, gellAllOrderAccordingtoUser);
router.get("/order/:orderId", checkLogin, getSingleOrderByUser);
// admin
router.get("/admin/orders", checkLogin, adminCheck, getAllOrder);
router.get(
  "/admin/order/:orderId",
  checkLogin,
  adminCheck,
  getSingleOrderByUserForAdmin,
);
export default router;
