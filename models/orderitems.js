import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";

export const OrderItems = sequelize.define(
  "OrderItem",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "orders",
        key: "orderId",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discountTotal: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    afterDiscountTotal: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "orderItems",
    sequelize,
  },
);
