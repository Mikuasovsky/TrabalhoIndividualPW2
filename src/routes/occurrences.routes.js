import { Router } from "express";
import OccurrenceController from "../controllers/OccurrenceController.js";
import CommentController from "../controllers/CommentController.js";
import {
	verifyToken,
	requireAnyRole,
	requireRole
} from "../middlewares/auth.js";

const router = Router();

router.post("/", verifyToken, requireRole("user"), OccurrenceController.create);
router.get("/", verifyToken, OccurrenceController.getAll);
router.get("/:id", verifyToken, OccurrenceController.getById);
router.put("/:id", verifyToken, OccurrenceController.update);
router.delete("/:id", verifyToken, OccurrenceController.delete);

// Rotas específicas
router.post(
	"/:id/status",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	OccurrenceController.updateStatus
);
router.patch(
	"/:id/priority",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	OccurrenceController.updatePriority
);
// align with plan via /occurrences/:id/status

// Rotas de comentários
router.post("/:id/comments", verifyToken, CommentController.create);
router.get("/:id/comments", verifyToken, CommentController.getAll);

export default router;
