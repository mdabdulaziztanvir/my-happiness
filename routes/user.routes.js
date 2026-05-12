import express from "express";
import {
  allUsers,
  createUser,
  deleteSingleUser,
  forgetPassword,
  getSingleUser,
  loginUser,
  logout,
  makeAdmin,
  me,
  refresh,
  updatePassword,
  updateUser,
  validateOtp,
} from "../controllers/user.controller.js";
import { adminCheck, checkLogin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.post("/refresh", refresh);
router.post("/admined/:id", checkLogin, adminCheck, makeAdmin);
router.post("/deleted/:id", checkLogin, adminCheck, deleteSingleUser);
router.put("/updated/:id", checkLogin, adminCheck, updateUser);
router.get("/user/:id", checkLogin, adminCheck, getSingleUser);
router.post("/user/reset-password", forgetPassword);
router.post("/user/validate-otp", validateOtp);
router.post("/user/update-password", updatePassword);
router.post("/logout", checkLogin, logout);

router.get("/me", checkLogin, me);

router.get("/find-all-user", checkLogin, adminCheck, allUsers);

export default router;
