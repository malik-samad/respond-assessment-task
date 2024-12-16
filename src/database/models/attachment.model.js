import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../connection";

class Attachment extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(Models) {
    Attachment.belongsTo(Models.Note, {
      foreignKey: "noteId",
      onDelete: "CASCADE",
    });
  }
}

Attachment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    noteId: { type: DataTypes.INTEGER, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: new SequelizeConnection().connection,
    timestamps: true,
    paranoid: true, // only Soft-delete as its related to notes
    modelName: "Attachment",
  }
);

export default Attachment;
