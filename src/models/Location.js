// Importação dos tipos de dados do Sequelize
import { DataTypes } from "sequelize";
// Importação da configuração da base de dados
import sequelize from "../config/database.js";

// Definição do modelo Location (Localização)
// Representa os locais onde ocorrem os problemas (edifícios, salas, etc.)
const Location = sequelize.define("Location", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  building: { type: DataTypes.STRING, allowNull: false },          // Edifício
  floor: { type: DataTypes.STRING },                                // Piso
  room: { type: DataTypes.STRING },                                  // Sala
  description: { type: DataTypes.STRING },                           // Descrição do local
  latitude: { type: DataTypes.DECIMAL(10, 6) },                    // Coordenada GPS latitude
  longitude: { type: DataTypes.DECIMAL(10, 6) }                     // Coordenada GPS longitude
}, {
  timestamps: true  // Cria automaticamente createdAt e updatedAt
});

export default Location;
