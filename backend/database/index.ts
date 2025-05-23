import { Sequelize } from "sequelize";
import databasePath from "../utils/databasePath";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: databasePath,
  logging: false,
});


