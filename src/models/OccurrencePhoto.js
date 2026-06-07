// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo OccurrencePhoto (Foto de Ocorrência)
// Representa as fotografias associadas às ocorrências
const OccurrencePhoto = sequelize.define("OccurrencePhoto", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  occurrence_id: { type: DataTypes.INTEGER, allowNull: false },  // ID da ocorrência
  url: { type: DataTypes.STRING, allowNull: false },            // URL da foto
  uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }  // Data de upload
}, {
  timestamps: false  // Não cria createdAt/updatedAt automáticos (usamos uploaded_at manual)
});

export default OccurrencePhoto;
