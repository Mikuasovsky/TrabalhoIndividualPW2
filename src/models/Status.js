import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Status = sequelize.define("Status", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: true
});

export default Status;
