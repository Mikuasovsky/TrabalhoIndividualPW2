import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Employee = sequelize.define("Employee", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  timestamps: true
});

export default Employee;
