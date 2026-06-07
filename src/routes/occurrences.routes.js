// Importação do Router do Express
import { Router } from "express";
// Importação dos controllers
import OccurrenceController from "../controllers/OccurrenceController.js";
import CommentController from "../controllers/CommentController.js";
// Importação dos middlewares de autenticação e autorização
import {
	verifyToken,
	requireAnyRole,
	requireRole,
	requireAdmin
} from "../middlewares/auth.js";

const router = Router();

// Criar ocorrência (user, admin ou employee)
router.post("/", verifyToken, requireAnyRole(["user", "admin", "employee"]), OccurrenceController.create);
// Listar ocorrências (todos os utilizadores autenticados)
router.get("/", verifyToken, OccurrenceController.getAll);

// Estatísticas RESTful (admin only) - deve vir antes de /:id para não ser confundido com ID
router.get(
	"/stats",
	verifyToken,
	requireAdmin,
	OccurrenceController.getStats
);

// Buscar ocorrência por ID
router.get("/:id", verifyToken, OccurrenceController.getById);
// Atualizar ocorrência (criador ou admin)
router.put("/:id", verifyToken, OccurrenceController.update);
// Apagar ocorrência (soft delete, criador ou admin)
router.delete("/:id", verifyToken, OccurrenceController.delete);

// Rotas específicas (sub-resources RESTful)
// Atualizar status da ocorrência (employee ou admin)
router.put(
	"/:id/status",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	OccurrenceController.updateStatus
);
// Atualizar prioridade da ocorrência (employee ou admin)
router.put(
	"/:id/priority",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	OccurrenceController.updatePriority
);

// Rotas de comentários (sub-resources)
// Criar comentário numa ocorrência
router.post("/:id/comments", verifyToken, CommentController.create);
// Listar comentários de uma ocorrência
router.get("/:id/comments", verifyToken, CommentController.getAll);

export default router;
