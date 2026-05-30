import { Router } from "express";
import CommentController from "../controllers/CommentController.js";
import CommentFlagController from "../controllers/CommentFlagController.js";
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.delete("/:id", verifyToken, requireAdmin, CommentController.delete);
router.post("/:id/flags", verifyToken, CommentFlagController.create);

export default router;
