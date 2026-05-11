import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import sequelize from "./config/dbConnect.js";
dotenv.config();

//importing models
import "./models/UserModel.js";

// importing routes
import userRoutes from "./routes/user.routes.js";
import multerRoutes from "./routes/multer.route.js";
// server setup
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: [
      "http://192.168.88.12:5173",
      "http://aat.c:5173",
      "https://myhappinessreact.grubdev.top",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/test", (req, res) => {
  return res.send("ok");
});

app.use("/api", userRoutes);
app.use("/api", multerRoutes);
// 404 error handling express
app.use((req, res, next) => {
  const error = new Error("url not found from tanvir");
  error.status = 404;
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;

  // also need to add headers alread sent error
  // log file a save kore rakhte hobe
  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message || "error from global error hadling by tanvir"
        : "something went wrong",
    handledBy: "tanvir's global handler",
  });
});
// database connection
const databaseConnection = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("database connected successfully");
  } catch (error) {
    console.log("database not connected");
    process.exit(1);
  }
};
databaseConnection();

app.listen(5002, "0.0.0.0", () => {
  console.log("server running");
});
