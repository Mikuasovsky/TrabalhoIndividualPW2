// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo Status (Estado)
// Representa os estados das ocorrências (ex: Pendente, Em tratamento, Resolvida, Rejeitada)
const Status = sequelize.define("Status", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },              // Nome do estado
  is_final: { type: DataTypes.BOOLEAN, defaultValue: false }     // Se é um estado final (resolvida/rejeitada)
}, {
  timestamps: true  // Cria automaticamente createdAt e updatedAt
});

export default Status;
