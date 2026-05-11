import express from "express";
import { multerFileHandle } from "../controllers/multer.controller.js";
import { adminCheck, checkLogin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/upload", checkLogin, multerFileHandle);

export default router;
