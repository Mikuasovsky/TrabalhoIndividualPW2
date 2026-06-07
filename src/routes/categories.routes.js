// Importação do Router do Express
import { Router } from "express";
// Importação do controller de categorias
import CategoryController from "../controllers/CategoryController.js";
// Importação dos middlewares de autenticação e autorização
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

// CRUD de categorias (admin only)
router.post("/", verifyToken, requireAdmin, CategoryController.create);
router.get("/", verifyToken, requireAdmin, CategoryController.getAll);
router.get("/:id", verifyToken, requireAdmin, CategoryController.getById);
router.put("/:id", verifyToken, requireAdmin, CategoryController.update);
router.delete("/:id", verifyToken, requireAdmin, CategoryController.delete);

export default router;
