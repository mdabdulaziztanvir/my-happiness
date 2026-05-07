import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;

  try {
    const trimmedPass = password.trim();

    if (trimmedPass.length < 8 || trimmedPass.length >= 30) {
      return res
        .status(400)
        .json({ message: "enter a password with 8 to 30 character" });
    }

    const hashedPassword = await bcrypt.hash(trimmedPass, 12);

    const serverGeneratedUserName = await bcrypt.hash(name, 1);
    const minimanUniqueName = serverGeneratedUserName
      .toString(10)
      .substring(4, 16);

    const lowerCasedTrimmedMail = email.toLowerCase().trim();

    const uniqueEmailCheck = await User.findOne({
      where: { email: lowerCasedTrimmedMail },
    });
    if (uniqueEmailCheck) {
      return res.status(400).json({ message: "invalid email" });
    }

    const user = await User.create({
      name,
      username: minimanUniqueName,
      password: hashedPassword,
      phoneNumber,
      email: lowerCasedTrimmedMail,
    });

    const { password: _, ...safeData } = user.toJSON();
    return res
      .status(201)
      .json({ message: "welcome as new user", user: safeData });
  } catch (error) {
    return res.status(500).json({
      message: "unable to create user from routes",
      error: error.message,
    });
  }
};

// user login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const existingUser = await User.findOne({
      where: { username },
      attributes: ["id", "name", "username", "password", "phoneNumber"],
    });
    if (!existingUser) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const trimmedPass = password.trim();
    const comparePass = await bcrypt.compare(
      trimmedPass,
      existingUser.password,
    );
    if (!comparePass) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const { password: _, ...secureUser } = existingUser.toJSON();
    return res
      .status(200)
      .json({ message: "good to go", user: secureUser, token: accessToken });
  } catch (error) {
    return res.status(500).json({
      message: "unable to create user from routes",
      error: error.message,
    });
  }
};

export const allUsers = async (req, res) => {
  try {
    const allUser = await User.findAll();
    return res.status(200).json(allUser);
  } catch (error) {
    return res.status(500).json({ message: "unable to get user from routes" });
  }
};
