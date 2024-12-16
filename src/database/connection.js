import { Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_HOST,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PORT,
} from "../configs.js";
import { importModels } from "@sequelize/core";

export class SequelizeConnection {
  connection;
  constructor() {
    if (SequelizeConnection.instance) return SequelizeConnection.instance;

    this.connection = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
      host: DB_HOST,
      dialect: "mysql",
      port: DB_PORT,
      sync: true,
    });
    SequelizeConnection.instance = this;
  }
}
