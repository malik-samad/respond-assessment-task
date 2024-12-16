import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../connection.js";
import bcrypt from "bcryptjs";

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(Models) {
    // Associations
    User.hasMany(Models.Note, { foreignKey: "userId" });
    User.hasMany(Models.NoteAccess, {
      foreignKey: "sharedWithUserId",
    });
  }
  static publicFields = ["id", "username", "email"];
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: new SequelizeConnection().connection,
    timestamps: true,
    modelName: "User",

    // Hooks
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10); // Hash password with a salt round of 10
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10); // Re-hash password if it changes
        }
      },
    },
  }
);

export default User;
