import { Blog } from "./blog.js";
import { Cart } from "./cart.js";
import { OTPModel } from "./OTPModel.js";
import { Product } from "./product.js";
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
// blog
User.hasMany(Blog, {
  foreignKey: "authorId",
  as: "blogs",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Blog.belongsTo(User, {
  foreignKey: "authorId",
  as: "author",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// admin and produc creating relation
User.hasMany(Product, {
  foreignKey: "adminId",
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.belongsTo(User, {
  foreignKey: "adminId",
  as: "admin",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// user cart product model relation

// User ↔ Cart
User.hasMany(Cart, {
  foreignKey: "userId",
  as: "carts",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Product ↔ Cart
Product.hasMany(Cart, {
  foreignKey: "productId",
  as: "carts",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Cart.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
