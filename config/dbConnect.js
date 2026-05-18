import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },

    dialectOptions: {
      charset: "utf8mb4",
    },
  },
);
export default sequelize;
