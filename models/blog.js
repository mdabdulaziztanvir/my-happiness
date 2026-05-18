import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";

export const Blog = sequelize.define(
  "Blog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "blogs",
    timestamps: true,
    sequelize,
  },
);
