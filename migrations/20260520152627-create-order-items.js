"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("orderItems", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    orderId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "orders",
        key: "orderId",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    total: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    discountTotal: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    afterDiscountTotal: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    grandTotal: {
      type: Sequelize.FLOAT,
      allowNull: true,
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
  await queryInterface.dropTable("orderItems");
}
