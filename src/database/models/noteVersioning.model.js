import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../connection.js";

class NoteVersion extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(Models) {
    NoteVersion.belongsTo(Models.Note, { foreignKey: "noteId" });
  }
  static publicFields = ["id", "noteId", "version", "title", "content"];
}

NoteVersion.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    noteId: { type: DataTypes.INTEGER, allowNull: false },
    version: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize: new SequelizeConnection().connection,
    modelName: "NoteVersion",
    timestamps: true,
    paranoid: true, // only Soft-delete
  }
);

export default NoteVersion;
