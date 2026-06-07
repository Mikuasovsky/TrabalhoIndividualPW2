// Importação do Router do Express
import { Router } from "express";
// Importação do controller de autenticação
import AuthController from "../controllers/AuthController.js";

const router = Router();

// POST /sessions - Login (criar sessão) - endpoint público
router.post("/", AuthController.login);

export default router;
