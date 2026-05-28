import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/", verifyToken, requireAdmin, CategoryController.create);
router.get("/", verifyToken, CategoryController.getAll);
router.get("/:id", verifyToken, CategoryController.getById);
router.put("/:id", verifyToken, requireAdmin, CategoryController.update);
router.delete("/:id", verifyToken, requireAdmin, CategoryController.delete);

export default router;
