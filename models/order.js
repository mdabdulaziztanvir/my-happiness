import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";

export const Order = sequelize.define(
  "Order",
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
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
      defaultValue: "pending",
    },
    paymentMethod: {
      type: DataTypes.ENUM("credit_card", "paypal", "cash_on_delivery"),
      allowNull: false,
      defaultValue: "cash_on_delivery",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
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
    grandTotal: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "orders",
    sequelize,
  },
);
