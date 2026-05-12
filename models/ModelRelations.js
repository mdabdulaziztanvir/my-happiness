import { OTPModel } from "./OTPModel.js";
import { User } from "./UserModel.js";

User.hasOne(OTPModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
OTPModel.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
