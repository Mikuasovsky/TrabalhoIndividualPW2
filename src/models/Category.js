// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo Category (Categoria)
// Representa as categorias de ocorrências (ex: Limpeza, Manutenção, Acessibilidade)
const Category = sequelize.define("Category", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },        // Nome da categoria
  description: { type: DataTypes.STRING }                    // Descrição da categoria
}, {
  timestamps: true  // Cria automaticamente createdAt e updatedAt
});

export default Category;
