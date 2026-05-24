import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  text: { type: DataTypes.TEXT, allowNull: false },

  user_id: { type: DataTypes.INTEGER, allowNull: false },

  occurrence_id: { type: DataTypes.INTEGER, allowNull: false },

  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true
});

export default Comment;
