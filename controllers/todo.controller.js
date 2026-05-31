import { Todo } from "../models/todo.js";
import { User } from "../models/UserModel.js";

export const createTodo = async (req, res) => {
  try {
    const { todoBody, isComplete } = req.body;
    const userId = req.id;
    if (!todoBody || isComplete) {
      return res.status(400).json({
        success: false,
        message: "please send all the fields for todo",
      });
    }
    const isValidUser = await User.findOne({ where: { id: userId } });
    if (!isValidUser)
      return res.json({ success: false, message: "you not a valid user" });
    const todo = await Todo.create({
      todoBody,

      userId,
    });
    return res
      .status(201)
      .json({ success: true, message: "new todo added", todo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error creating todo",
      error: error.message,
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;
    const isValidUser = await User.findOne({ where: { id: userId } });

    if (!isValidUser)
      return res.json({ success: false, message: "you not a valid user" });

    const isValidTodo = await Todo.findOne({ where: { id, userId } });
    if (!isValidTodo)
      return res.json({
        success: false,
        message: "this to do can not be deleted",
      });
    const deleteTodo = await isValidTodo.destroy();
    return res.status(200).json({
      success: true,
      message: `${isValidTodo?.todoBody} has been deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error deleting todo",
      error: error.message,
    });
  }
};
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;
    const { todoBody } = req.body;

    const isValidUser = await User.findOne({ where: { id: userId } });

    if (!isValidUser)
      return res.json({ success: false, message: "you not a valid user" });

    const isValidTodo = await Todo.findOne({ where: { id, userId } });
    if (!isValidTodo)
      return res.json({
        success: false,
        message: "this to do can not be deleted",
      });
    isValidTodo.todoBody = todoBody || "";
    const updatedTodo = await isValidTodo.save();
    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error creating todo",
      error: error.message,
    });
  }
};
export const getAllTodos = async (req, res) => {
  try {
    const userId = req.id;

    const isValidUser = await User.findOne({ where: { id: userId } });
    if (!isValidUser)
      return res.json({ success: false, message: "you not a valid user" });

    const todos = await Todo.findAll({
      where: { userId },
      order: [["id", "DESC"]],
    });
    if (!todos)
      return res.status(404).json({
        success: false,
        message: "you do not have any todo, please create one",
      });
    return res
      .status(200)
      .json({ success: true, message: "here all your todo", todos });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error creating todo",
      error: error.message,
    });
  }
};
export const getSingleTodo = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error creating todo",
      error: error.message,
    });
  }
};
