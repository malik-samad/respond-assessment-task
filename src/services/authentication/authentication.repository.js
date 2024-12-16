import bcrypt from "bcrypt";
import { Models } from "../../database/models/index.js";
import { escape } from "sequelize/lib/sql-string";

export class AuthenticationRepository {
  constructor() {
    if (AuthenticationRepository.instance)
      return AuthenticationRepository.instance;

    this.User = new Models().User;
    AuthenticationRepository.instance = this;
  }

  create = async (user) => {
    const { username, email, password } = user;

    const createdUser = await this.User.create({
      username,
      email,
      password,
    });

    return createdUser.id;
  };

  getById = async (id) => {
    return this.User.findOne({
      where: { id },
      attributes: this.User.publicFields,
    });
  };

  getByEmailAndPassword = async (email, password) => {
    const user = await this.User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
    return user;
  };
}
