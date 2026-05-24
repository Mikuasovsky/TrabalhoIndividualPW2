import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OccurrencePhoto = sequelize.define("OccurrencePhoto", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  occurrence_id: { type: DataTypes.INTEGER, allowNull: false },

  url: { type: DataTypes.STRING, allowNull: false },

  uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

export default OccurrencePhoto;
