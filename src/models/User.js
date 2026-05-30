import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("user", "employee", "admin"), allowNull: false },
  is_suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_validated: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true
});

export default User;
