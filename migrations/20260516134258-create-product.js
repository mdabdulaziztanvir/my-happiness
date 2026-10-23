"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("products", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    adminId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    discount: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    dicCountedPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    productDescription: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    productImage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("products");
}
