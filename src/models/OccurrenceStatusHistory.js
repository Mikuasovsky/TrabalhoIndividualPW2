// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo OccurrenceStatusHistory (Histórico de Status)
// Regista todas as mudanças de status de uma ocorrência
const OccurrenceStatusHistory = sequelize.define("OccurrenceStatusHistory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  occurrence_id: { type: DataTypes.INTEGER, allowNull: false },  // ID da ocorrência
  status_id: { type: DataTypes.INTEGER, allowNull: false },      // ID do status
  changed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }  // Data da mudança
}, {
  timestamps: false  // Não cria createdAt/updatedAt automáticos (usamos changed_at manual)
});

export default OccurrenceStatusHistory;
