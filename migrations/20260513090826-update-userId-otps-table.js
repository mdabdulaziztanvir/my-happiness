"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.changeColumn("otps", "userId", {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,

    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.changeColumn("otps", "userId", {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  });
}
