import { Blog } from "./blog.js";
import { Cart } from "./cart.js";
import { Order } from "./order.js";
import { OrderItems } from "./orderitems.js";
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

// order relation ===============
User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
// =========================
Order.hasMany(OrderItems, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
OrderItems.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
// ===========================
User.hasMany(OrderItems, {
  foreignKey: "userId",
  as: "orderItems",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
OrderItems.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
// ======================
Product.hasMany(OrderItems, {
  foreignKey: "productId",
  as: "orderItems",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
OrderItems.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
