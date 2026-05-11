import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import { Op } from "sequelize";

export const checkLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization)
      return res.status(400).json({ message: "send the request properway" });
    // const bearerCheck = authorization.includes("Bearer");
    if (!authorization.startsWith("Bearer "))
      return res.status(400).json({ message: "no bearer provider" });

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "expired token" });
    }
    return res
      .status(500)
      .json({ message: "you are not authenticated", error: error.message });
  }
};
export const adminCheck = async (req, res, next) => {
  const id = req.id;
  try {
    const isAdmin = await User.findOne({
      where: { [Op.and]: [{ id }, { adminValue: 1 }] },
    });
    if (!isAdmin)
      return res.status(400).json({ message: "you are not an admin" });
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something wrong when admin check" });
  }
};
