import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { Op, where } from "sequelize";
import crypto from "crypto";
// import { randomInt } from "crypto";
import { OTPModel } from "../models/OTPModel.js";
import { sendOTPEmail } from "../utils/brevoForgetMail.js";

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
  // username name deya holeo eta diye username and email kina 2 tay check kore kaj kora hobe
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email: username }] },
      attributes: [
        "id",
        "name",
        "username",
        "password",
        "phoneNumber",
        "adminValue",
        "email",
      ],
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
        expiresIn: "10m",
      },
    );

    const refreshToken = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const { password: _, ...secureUser } = existingUser.toJSON();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      // path: '/api/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "good to go",
      user: secureUser,
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "unable to create user from routes",
      error: error.message,
    });
  }
};
// logout user
export const logout = async (req, res) => {
  try {
    await res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "logout successfully" });
  } catch (error) {
    return res.status(400).json({ message: "invalid cookies" });
  }
};
// forget user
export const forgetPassword = async (req, res) => {
  const { forgetCredit } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: forgetCredit }, { email: forgetCredit }],
      },
      attributes: ["id", "email", "username"],
    });
    if (!user)
      return res.status(400).json({
        message: "Please Enter valid Username or Password and try again...",
      });

    const otp = crypto.randomInt(10000, 999999).toString();
    // expires after two minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // check already have the id in the databse of otps

    const existingOtp = await OTPModel.findOne({ where: { userId: user.id } });
    let otpData;
    if (existingOtp) {
      otpData = await existingOtp.update({
        otp,
        expiresAt,
      });
    } else {
      otpData = await OTPModel.create({
        userId: user.id,
        otp,
        expiresAt,
      });
    }

    await sendOTPEmail(user.email, user.username, otp);

    return res
      .status(200)
      .json({ message: "found user", user, otp: otpData.id });
  } catch (error) {
    return res.status(500).json({
      message: "unable to forget pasword",
      error: error.message,
    });
  }
};
// export const validate otp and generae a new password
export const validateOtp = async (req, res) => {
  const { validateOtp, userUuid } = req.body;

  try {
    const validOtpData = await OTPModel.findOne({
      where: { id: userUuid, otp: validateOtp },
    });
    if (!validOtpData)
      return res.status(400).json({ message: "otp mismatched" });

    // check otp expirrdate
    if (new Date() > validOtpData.expiresAt) {
      await validOtpData.destroy();
      return res.status(400).json({ message: "otp expired" });
    }

    return res
      .status(200)
      .json({ message: "otp matched now create a new password" });
  } catch (error) {
    return res.status(500).json({
      message: "unable to validate otp ",
      error: error.message,
    });
  }
};
// update password
export const updatePassword = async (req, res) => {
  const { validateOtp, userUuid, newPassword } = req.body;
  try {
    const validateOtpDB = await OTPModel.findOne({
      where: { id: userUuid, otp: validateOtp },
    });
    if (!validateOtpDB) return res.status(400).json({ message: "invalid otp" });
    if (new Date() > validateOtpDB.expiresAt) {
      validateOtpDB.destroy();

      return res.status(400).json({ message: "expired token" });
    }

    // userdId diye user khoja

    const user = await User.findOne({ where: { id: validateOtpDB.userId } });
    if (!user)
      return res.status(400).json({ message: "you are not a valid user" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    validateOtpDB.destroy();

    return res.status(200).json({ message: "password Updates successfull," });
  } catch (error) {
    return res.status(500).json({
      message: "unable to validate otp ",
      error: error.message,
    });
  }
};
// get all user
export const allUsers = async (req, res) => {
  try {
    const allUser = await User.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({ user: allUser });
  } catch (error) {
    return res.status(500).json({ message: "unable to get user from routes" });
  }
};
// make a user to admin
export const makeAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(400).json({ message: "user not found" });

    if (user.adminValue === 1)
      return res.status(400).json({ message: "This user is already Admin" });

    const adminDone = await user.update(
      { adminValue: 1 },
      { where: { id: id } },
    );

    return res
      .status(200)
      .json({ message: "You Have Successfully Made a new Admin", adminDone });
  } catch (error) {
    return res.status(500).json({ message: "error making user admin" });
  }
};
// delete a user
export const deleteSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(400).json({ message: "user khuje paoa jayni" });
    if (user.adminValue === 1)
      return res.status(400).json({ message: "you can not delete a admin" });
    const deletedUser = await user.destroy();
    const { password: _, ...safeUser } = user.toJSON();
    return res
      .status(200)
      .json({ message: "user has been deleted", user: safeUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error deleteding user", error: error?.message });
  }
};
// update a single user

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, mobile, name, adminValue } = req.body;
  try {
    const user = await User.findByPk(id);

    if (!user)
      return res.status(400).json({ message: "user khuje paoa jayni" });
    const uniqueUsernameEmail = await User.findOne({
      where: {
        [Op.and]: [
          { [Op.or]: [{ username: username || "" }, { email: email || "" }] },
          { id: { [Op.ne]: id } },
        ],
      },
    });
    if (uniqueUsernameEmail)
      return res.status(400).json({
        message: "This Username Or Email Already used, try a different one...",
      });
    user.name = name ? name : user.name;

    user.username = username ? username : user.username;
    user.email = email ? email : user.email;

    user.mobile = mobile ? mobile : user.mobile;
    if (adminValue !== undefined) {
      user.adminValue = adminValue ? adminValue : user.adminValue;
    }

    await user.save();
    const { password: _, ...safeUser } = user.toJSON();
    return res
      .status(200)
      .json({ message: "user updated successfull", user: safeUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error updating user", error: error });
  }
};
// get single user
export const getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const { password: _, ...safeUser } = user.toJSON();
    return res.status(200).json({ user: safeUser });
  } catch (error) {
    return res.status(500).json({
      message: "error fetching user",
    });
  }
};
// refrrwsh logic with refrsh cookies
export const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  const refreshToken = cookies.refreshToken;

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    // Generate a fresh new Access Token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  });
};
// profile me after every refrsh
export const me = async (req, res) => {
  const id = req.id;
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(400).json({ message: "not authenticatted me" });
    const { password: _, ...safeUser } = user.toJSON();

    return res.json({ user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: "unable to get user from routes" });
  }
};
