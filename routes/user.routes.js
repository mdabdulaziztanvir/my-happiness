import express from "express";
import {
  allUsers,
  createUser,
  forgetPassword,
  loginUser,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.post("/forget-password", forgetPassword);

router.get("/find-all-user", allUsers);

export default router;
