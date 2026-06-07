// Importação do Router do Express
import { Router } from "express";
// Importação dos controllers
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
// Importação dos middlewares de autenticação e autorização
import {
	verifyToken,
	requireAdmin,
	requireSelfOrAdmin
} from "../middlewares/auth.js";

const router = Router();

// POST /users/register - Registo público (sem autenticação)
router.post("/register", AuthController.register);

// Endpoints protegidos (requer autenticação)
// Criar utilizador (admin only)
router.post("/", verifyToken, requireAdmin, UserController.create);
// Listar todos os utilizadores (admin only)
router.get("/", verifyToken, requireAdmin, UserController.getAll);
// Buscar utilizador por ID (próprio utilizador ou admin)
router.get("/:id", verifyToken, requireSelfOrAdmin, UserController.getById);
// Atualizar utilizador (próprio utilizador ou admin)
router.put("/:id", verifyToken, requireSelfOrAdmin, UserController.update);
// Apagar utilizador (admin only)
router.delete("/:id", verifyToken, requireAdmin, UserController.delete);
// Suspender utilizador (sub-resource RESTful, admin only)
router.put("/:id/suspend", verifyToken, requireAdmin, UserController.suspend);

export default router;
