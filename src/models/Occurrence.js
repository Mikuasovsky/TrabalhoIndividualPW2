import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Occurrence = sequelize.define("Occurrence", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  title: { type: DataTypes.STRING, allowNull: false },

  description: { type: DataTypes.TEXT, allowNull: false },

  priority: { 
    type: DataTypes.ENUM("low", "medium", "high"),
    allowNull: false,
    defaultValue: "low"
  },

  // Foreign Keys
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  location_id: { type: DataTypes.INTEGER, allowNull: false },
  current_status_id: { type: DataTypes.INTEGER, allowNull: false },

  treatment_description: { type: DataTypes.TEXT },
  resolution_date_expected: { type: DataTypes.DATE },
  resolution_date_actual: { type: DataTypes.DATE },

  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true
});

export default Occurrence;
