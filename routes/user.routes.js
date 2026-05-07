import express from "express";
import {
  allUsers,
  createUser,
  loginUser,
} from "../controllers/user.controllers.js";
const router = express.Router();

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.get("/find-all-user", allUsers);

export default router;
