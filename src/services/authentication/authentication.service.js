import { AuthenticationRepository } from "./authentication.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

export class AuthenticationService {
  constructor() {
    if (AuthenticationService.instance) return AuthenticationService.instance;

    this.Repository = new AuthenticationRepository();
    AuthenticationService.instance = this;
  }

  register = async (user) => {
    return this.Repository.create(user);
  };

  login = async (email, password) => {
    const user = await this.Repository.getByEmailAndPassword(email, password);
    const token = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    return { token, refreshToken };
  };

  getById = async (id) => this.Repository.getById(id);

  refreshAccessToken = async (refreshToken) => {
    const { id } = verifyRefreshToken(refreshToken);
    if (!id) throw new Error("Unauthorized");

    const token = generateAccessToken(id);
    return token;
  };
}
