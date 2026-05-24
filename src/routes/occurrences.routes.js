import { Router } from "express";
import OccurrenceController from "../controllers/OccurrenceController.js";
import CommentController from "../controllers/CommentController.js";

const router = Router();

router.get("/", OccurrenceController.getAll);
router.get("/:id", OccurrenceController.getById);
router.put("/:id", OccurrenceController.update);
router.delete("/:id", OccurrenceController.delete);

// Rotas específicas
router.patch("/:id/status", OccurrenceController.updateStatus);
router.patch("/:id/priority", OccurrenceController.updatePriority);

// Rotas de comentários
router.post("/:id/comments", CommentController.create);
router.get("/:id/comments", CommentController.getAll);
router.delete("/:id/comments/:commentId", CommentController.delete); // ⭐ ESTA FALTAVA

export default router;
