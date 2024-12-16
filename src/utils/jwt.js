import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../configs";

export function generateAccessToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(id) {
  return jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
