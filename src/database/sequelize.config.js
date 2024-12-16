// used for CLI
require("babel-register");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: process.env.DB_PORT,
};
