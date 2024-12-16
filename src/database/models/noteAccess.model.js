import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../connection.js";
import { NOTE_PERMISSION } from "../../utils/constants.js";

class NoteAccess extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  static associate(Models) {
    NoteAccess.belongsTo(Models.User, {
      foreignKey: "userId",
    });
    NoteAccess.belongsTo(Models.Note, {
      foreignKey: "noteId",
    });
  }
}

NoteAccess.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    noteId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    permission: {
      type: DataTypes.ENUM(...Object.keys(NOTE_PERMISSION)),
      defaultValue: "READ_ONLY",
    },
  },
  {
    sequelize: new SequelizeConnection().connection,
    timestamps: true,
    modelName: "NoteAccess",
  }
);

export default NoteAccess;
