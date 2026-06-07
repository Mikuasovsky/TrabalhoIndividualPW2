// Importação do Router do Express
import { Router } from "express";
// Importação dos controllers de comentários
import CommentController from "../controllers/CommentController.js";
import CommentFlagController from "../controllers/CommentFlagController.js";
// Importação dos middlewares de autenticação e autorização
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

// Apagar comentário (admin only)
router.delete("/:id", verifyToken, requireAdmin, CommentController.delete);
// Sinalizar comentário (sub-resource RESTful)
router.post("/:id/flags", verifyToken, CommentFlagController.create);

export default router;
