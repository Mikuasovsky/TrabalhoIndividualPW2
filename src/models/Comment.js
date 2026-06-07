// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo Comment (Comentário)
// Representa os comentários feitos nas ocorrências
const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  text: { type: DataTypes.TEXT, allowNull: false },              // Texto do comentário
  user_id: { type: DataTypes.INTEGER, allowNull: false },        // ID do utilizador que comentou
  occurrence_id: { type: DataTypes.INTEGER, allowNull: false },  // ID da ocorrência comentada
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }   // Soft delete
}, {
  timestamps: true  // Cria automaticamente createdAt e updatedAt
});

export default Comment;
