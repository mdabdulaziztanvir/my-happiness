"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.changeColumn("products", "productDescription", {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  });

  await queryInterface.sequelize.query(`
    ALTER TABLE products
    CONVERT TO CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
  `);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.changeColumn("products", "productDescription", {
    type: Sequelize.TEXT,
    allowNull: false,
  });
  await queryInterface.sequelize.query(`
    ALTER TABLE products
    CONVERT TO CHARACTER SET utf8
    COLLATE utf8_unicode_ci;
  `);
}
