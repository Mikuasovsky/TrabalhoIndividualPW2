// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo CommentFlag (Sinalização de Comentário)
// Representa as sinalizações de comentários indevidos
const CommentFlag = sequelize.define("CommentFlag", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  comment_id: { type: DataTypes.INTEGER, allowNull: false },   // ID do comentário sinalizado
  user_id: { type: DataTypes.INTEGER, allowNull: false },        // ID do utilizador que sinalizou
  reason: { type: DataTypes.STRING, allowNull: false },          // Motivo da sinalização
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }  // Data da sinalização
}, {
  timestamps: false  // Não cria createdAt/updatedAt automáticos (usamos created_at manual)
});

export default CommentFlag;
