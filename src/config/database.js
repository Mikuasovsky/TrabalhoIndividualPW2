// Importação do Sequelize (ORM para Node.js)
import { Sequelize } from "sequelize";
// Carregamento de variáveis de ambiente
import "dotenv/config";

// Configuração da conexão com a base de dados MySQL
// Usa variáveis de ambiente para credenciais (segurança)
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nome da base de dados
  process.env.DB_USER,      // Utilizador da base de dados
  process.env.DB_PASSWORD,  // Password da base de dados
  {
    host: process.env.DB_HOST,     // Host da base de dados
    port: process.env.DB_PORT,     // Porta da base de dados
    dialect: "mysql",              // Tipo de base de dados
    logging: false,                // Desativa logging de queries SQL em produção
  }
);

// Exportação da instância do Sequelize para uso em outros ficheiros
export default sequelize;
