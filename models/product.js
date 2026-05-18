import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";

export const Product = sequelize.define(
  "Product",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dicCountedPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    productDescription: {
      type: DataTypes.TEXT("tiny"),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true, tableName: "products", sequelize },
);
