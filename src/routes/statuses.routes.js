import { Router } from "express";
import StatusController from "../controllers/StatusController.js";
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/", verifyToken, requireAdmin, StatusController.create);
router.get("/", verifyToken, requireAdmin, StatusController.getAll);
router.get("/:id", verifyToken, requireAdmin, StatusController.getById);
router.put("/:id", verifyToken, requireAdmin, StatusController.update);
router.delete("/:id", verifyToken, requireAdmin, StatusController.delete);

export default router;
