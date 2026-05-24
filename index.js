import express from "express";
import "dotenv/config";
import sequelize from "./src/config/database.js";
import "./src/associations/index.js";
import routes from "./src/routes/index.js";

const app = express();
app.use(express.json());

// Rotas
app.use("/api", routes);

// Sincronizar tabelas automaticamente
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("📦 Tabelas sincronizadas com sucesso!");
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar tabelas:", err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor a correr em http://localhost:${PORT}`);
});
