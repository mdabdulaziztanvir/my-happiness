import express from "express";
import {
  createProduct,
  destrySingleProduc,
  getAllProducts,
  getAllProductsForUser,
  getSingleProduct,
  getSingleProductForUser,
  productUpload,
  updateProduct,
  uploadedImageresponse,
} from "../controllers/product.controller.js";
import { adminCheck, checkLogin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/product", checkLogin, adminCheck, createProduct);
router.post(
  "/product/image-upload",

  productUpload.single("productImage"),
  uploadedImageresponse,
);

// user get all products
router.get("/products", checkLogin, adminCheck, getAllProducts);
router.delete(
  "/product/destroy/:slug",
  checkLogin,
  adminCheck,
  destrySingleProduc,
);
router.get("/product/:slug", checkLogin, adminCheck, getSingleProduct);

router.patch("/product/update/:slug", checkLogin, adminCheck, updateProduct);

// user routes for products
router.get("/products/for-user", checkLogin, getAllProductsForUser);
router.get("/product/for-user/:slug", checkLogin, getSingleProductForUser);
export default router;
