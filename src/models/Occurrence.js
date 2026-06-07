// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo Occurrence (Ocorrência)
// Representa as ocorrências reportadas pelos utilizadores
const Occurrence = sequelize.define("Occurrence", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  title: { type: DataTypes.STRING, allowNull: false },              // Título da ocorrência

  description: { type: DataTypes.TEXT, allowNull: false },         // Descrição detalhada

  priority: {
    type: DataTypes.ENUM("baixa", "media", "alta", "critica"),      // Prioridade de resolução
    allowNull: false,
    defaultValue: "baixa"
  },

  // Foreign Keys (chaves estrangeiras)
  created_by: { type: DataTypes.INTEGER, allowNull: false },       // ID do utilizador que criou
  category_id: { type: DataTypes.INTEGER, allowNull: false },        // ID da categoria
  location_id: { type: DataTypes.INTEGER, allowNull: false },        // ID da localização
  current_status_id: { type: DataTypes.INTEGER, allowNull: false },   // ID do status atual

  treatment_description: { type: DataTypes.TEXT },                   // Descrição do tratamento
  resolution_date_expected: { type: DataTypes.DATE },                // Data prevista para resolução
  resolution_date_actual: { type: DataTypes.DATE },                  // Data real de resolução

  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }       // Soft delete (não apaga fisicamente)
}, {
  timestamps: true  // Cria automaticamente createdAt e updatedAt
});

export default Occurrence;
