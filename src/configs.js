import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: "./.env" });

export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  REDIS_URL,
  REDIS_PASSWORD,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
} = process.env;

export const isDev = NODE_ENV === "development";
export const isProd = NODE_ENV === "production";
