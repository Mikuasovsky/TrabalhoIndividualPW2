import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OccurrenceStatusHistory = sequelize.define("OccurrenceStatusHistory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  occurrence_id: { type: DataTypes.INTEGER, allowNull: false },

  status_id: { type: DataTypes.INTEGER, allowNull: false },

  changed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

export default OccurrenceStatusHistory;
