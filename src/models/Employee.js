// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo Employee (Funcionário)
// Representa os funcionários (extensão do User para dados específicos de funcionários)
const Employee = sequelize.define("Employee", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false }         // Foreign key para User
}, {
  timestamps: true  // Cria automaticamente createdAt e updatedAt
});

export default Employee;
