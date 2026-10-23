"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("orders", {
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
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    orderId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    shippingAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    shippingCost: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    notes: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    status: {
      type: Sequelize.ENUM("pending", "shipped", "delivered", "cancelled"),
      defaultValue: "pending",
    },

    paymentMethod: {
      type: Sequelize.ENUM("credit_card", "paypal", "cash_on_delivery"),
      allowNull: false,
      defaultValue: "cash_on_delivery",
    },

    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
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
  await queryInterface.dropTable("orders");
}
