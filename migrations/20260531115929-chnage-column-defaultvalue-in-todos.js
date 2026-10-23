"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.changeColumn("todos", "isComplete", {
    allowNull: false,
    defaultValue: false,
    type: Sequelize.BOOLEAN,
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.changeColumn("todos", "isComplete", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
}
