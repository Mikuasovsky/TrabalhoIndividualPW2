// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo User (Utilizador)
// Representa os utilizadores do sistema (estudantes, docentes, funcionários, admins)
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },              // Nome do utilizador
  email: { type: DataTypes.STRING, allowNull: false, unique: true }, // Email (único)
  password: { type: DataTypes.STRING, allowNull: false },           // Password (hash com bcrypt)
  role: { type: DataTypes.ENUM("user", "employee", "admin"), allowNull: false }, // Role do utilizador
  is_suspended: { type: DataTypes.BOOLEAN, defaultValue: false },   // Se a conta está suspensa
  is_validated: { type: DataTypes.BOOLEAN, defaultValue: false }    // Se o funcionário foi validado pelo admin
}, {
  timestamps: true  // Cria automaticamente createdAt e updatedAt
});

export default User;
