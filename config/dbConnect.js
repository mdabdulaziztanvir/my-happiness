import { Sequelize } from "sequelize";

const sequelize = new Sequelize("my_happiness", "root", "12345678", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  logging: false,
});
export default sequelize;
