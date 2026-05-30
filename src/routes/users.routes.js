import { Router } from "express";
import UserController from "../controllers/UserController.js";
import {
	verifyToken,
	requireAdmin,
	requireSelfOrAdmin
} from "../middlewares/auth.js";

const router = Router();

router.post("/", verifyToken, requireAdmin, UserController.create);
router.get("/", verifyToken, requireAdmin, UserController.getAll);
router.get("/:id", verifyToken, requireSelfOrAdmin, UserController.getById);
router.put("/:id", verifyToken, requireSelfOrAdmin, UserController.update);
router.delete("/:id", verifyToken, requireAdmin, UserController.delete);
router.patch("/:id", verifyToken, requireAdmin, UserController.suspend);

export default router;
