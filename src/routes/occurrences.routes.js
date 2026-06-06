import { Router } from "express";
import OccurrenceController from "../controllers/OccurrenceController.js";
import CommentController from "../controllers/CommentController.js";
import {
	verifyToken,
	requireAnyRole,
	requireRole,
	requireAdmin
} from "../middlewares/auth.js";

const router = Router();

router.post("/", verifyToken, requireAnyRole(["user", "admin", "employee"]), OccurrenceController.create);
router.get("/", verifyToken, OccurrenceController.getAll);

// Estatísticas RESTful (admin only) - deve vir antes de /:id
router.get(
	"/stats",
	verifyToken,
	requireAdmin,
	OccurrenceController.getStats
);

router.get("/:id", verifyToken, OccurrenceController.getById);
router.put("/:id", verifyToken, OccurrenceController.update);
router.delete("/:id", verifyToken, OccurrenceController.delete);

// Rotas específicas
router.put(
	"/:id/status",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	OccurrenceController.updateStatus
);
router.put(
	"/:id/priority",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	OccurrenceController.updatePriority
);

// Rotas de comentários
router.post("/:id/comments", verifyToken, CommentController.create);
router.get("/:id/comments", verifyToken, CommentController.getAll);

export default router;
