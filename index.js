import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import sequelize from "./config/dbConnect.js";

//importing models
import "./models/ModelRelations.js";
import "./models/UserModel.js";
import "./models/OTPModel.js";

// importing routes
import userRoutes from "./routes/user.routes.js";
import multerRoutes from "./routes/multer.route.js";
import blogRoutes from "./routes/blog.routes.js";
import productRouter from "./routes/product.route.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import todoRoutes from "./routes/todo.routes.js";
// server setup
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: [
      "http://192.168.88.21:5173",
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
app.use("/api/", blogRoutes);
app.use("/api/", productRouter);
app.use("/api/", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", todoRoutes);
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

const startServer = async () => {
  try {
    // first database connect then start the server
    await sequelize.authenticate();
    console.log("database connected successfully");

    const PORT = process.env.PORT;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("unable to connect to database", error);
    process.exit(1);
  }
};
startServer();
