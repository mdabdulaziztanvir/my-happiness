import express from "express";
import { checkLogin } from "../middlewares/auth.middleware.js";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  updateTodo,
} from "../controllers/todo.controller.js";
const router = express.Router();
router.post("/todo", checkLogin, createTodo);
router.get("/todos", checkLogin, getAllTodos);
router.delete("/todo/:id", checkLogin, deleteTodo);
router.patch("/todo/:id", checkLogin, updateTodo);
export default router;
