import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CommentFlag = sequelize.define("CommentFlag", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  comment_id: { type: DataTypes.INTEGER, allowNull: false },

  user_id: { type: DataTypes.INTEGER, allowNull: false },

  reason: { type: DataTypes.STRING, allowNull: false },

  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

export default CommentFlag;
