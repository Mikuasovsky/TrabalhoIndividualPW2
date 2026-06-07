// Importação do framework Express
import express from "express";
// Carregamento de variáveis de ambiente do ficheiro .env
import "dotenv/config";
// Importação da configuração da base de dados (Sequelize)
import sequelize from "./src/config/database.js";
// Importação das associações entre modelos (relações)
import "./src/associations/index.js";
// Importação das rotas da API
import routes from "./src/routes/index.js";

// Criação da aplicação Express
const app = express();
// Middleware para fazer parse do body das requisições em JSON
app.use(express.json());

// Todas as rotas ficam sob o prefixo /api
app.use("/api", routes);

// Sincronização automática das tabelas com a base de dados
// alter: true atualiza a estrutura das tabelas se houver mudanças nos modelos
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("📦 Tabelas sincronizadas com sucesso!");
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar tabelas:", err);
  });

// Porta do servidor (3000 por defeito, ou a definida em .env)
const PORT = process.env.PORT || 3000;

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor a correr em http://localhost:${PORT}`);
});
