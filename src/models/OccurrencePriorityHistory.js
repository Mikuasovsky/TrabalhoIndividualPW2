// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo OccurrencePriorityHistory (Histórico de Prioridade)
// Regista todas as mudanças de prioridade de uma ocorrência
const OccurrencePriorityHistory = sequelize.define("OccurrencePriorityHistory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  occurrence_id: { type: DataTypes.INTEGER, allowNull: false },  // ID da ocorrência
  priority: {
    type: DataTypes.ENUM("baixa", "media", "alta", "critica"),  // Prioridade
    allowNull: false
  },
  changed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }  // Data da mudança
}, {
  timestamps: false  // Não cria createdAt/updatedAt automáticos (usamos changed_at manual)
});

export default OccurrencePriorityHistory;
