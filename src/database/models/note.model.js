import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../connection.js";

class Note extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(Models) {
    Note.hasMany(Models.NoteAccess, { foreignKey: "noteId" });
    Note.hasMany(Models.NoteVersion, { foreignKey: "noteId" });
    Note.hasMany(Models.Attachment, {
      foreignKey: "noteId",
    });
  }
  static publicFields = ["id", "title", "content", "version", "updatedAt"];
}

Note.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    sequelize: new SequelizeConnection().connection,
    modelName: "Note",
    paranoid: true, // only Soft-delete
    indexes: [
      {
        type: "FULLTEXT",
        fields: ["title", "content"], // Specify the columns for the full-text index
      },
    ],
  }
);

export default Note;
