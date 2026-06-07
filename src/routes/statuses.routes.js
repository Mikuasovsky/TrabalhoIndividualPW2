// Importação do Router do Express
import { Router } from "express";
// Importação do controller de statuses
import StatusController from "../controllers/StatusController.js";
// Importação dos middlewares de autenticação e autorização
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

// CRUD de statuses (admin only)
router.post("/", verifyToken, requireAdmin, StatusController.create);
router.get("/", verifyToken, requireAdmin, StatusController.getAll);
router.get("/:id", verifyToken, requireAdmin, StatusController.getById);
router.put("/:id", verifyToken, requireAdmin, StatusController.update);
router.delete("/:id", verifyToken, requireAdmin, StatusController.delete);

export default router;
