import express from "express";
import { multerFileHandle } from "../controllers/multer.controller.js";
const router = express.Router();

router.post("/upload", multerFileHandle);

export default router;
