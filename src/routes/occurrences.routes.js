import { Router } from "express";
import OccurrenceController from "../controllers/OccurrenceController.js";
import CommentController from "../controllers/CommentController.js";
import CommentFlagController from "../controllers/CommentFlagController.js";
import {
	verifyToken,
	requireAdmin,
	requireAnyRole,
	requireRole
} from "../middlewares/auth.js";

const router = Router();

router.post("/", verifyToken, requireRole("student"), OccurrenceController.create);
router.get("/", verifyToken, OccurrenceController.getAll);
router.get("/:id", verifyToken, OccurrenceController.getById);
router.put("/:id", verifyToken, OccurrenceController.update);
router.delete("/:id", verifyToken, OccurrenceController.delete);

// Rotas específicas
router.patch(
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
router.patch(
	"/:id/treatment",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	OccurrenceController.updateTreatment
);

// Rotas de comentários
router.post("/:id/comments", verifyToken, CommentController.create);
router.get("/:id/comments", verifyToken, CommentController.getAll);
router.delete(
	"/:id/comments/:commentId",
	verifyToken,
	requireAdmin,
	CommentController.delete
);
router.post(
	"/:id/comments/:commentId/flags",
	verifyToken,
	CommentFlagController.create
);

export default router;
