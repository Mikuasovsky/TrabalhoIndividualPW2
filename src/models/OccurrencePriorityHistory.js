import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OccurrencePriorityHistory = sequelize.define("OccurrencePriorityHistory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  occurrence_id: { type: DataTypes.INTEGER, allowNull: false },

  priority: { 
    type: DataTypes.ENUM("low", "medium", "high"),
    allowNull: false
  },

  changed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

export default OccurrencePriorityHistory;
