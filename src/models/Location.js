import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Location = sequelize.define("Location", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  building: { type: DataTypes.STRING, allowNull: false },
  floor: { type: DataTypes.STRING },
  room: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  latitude: { type: DataTypes.DECIMAL(10, 6) },
  longitude: { type: DataTypes.DECIMAL(10, 6) }
}, {
  timestamps: true
});

export default Location;
