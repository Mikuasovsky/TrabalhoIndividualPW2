import { Router } from "express";
import StatsController from "../controllers/StatsController.js";
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/categories", verifyToken, requireAdmin, StatsController.occurrencesByCategory);
router.get("/statuses", verifyToken, requireAdmin, StatsController.occurrencesByStatus);
router.get("/buildings", verifyToken, requireAdmin, StatsController.occurrencesByBuilding);
router.get("/resolution-time", verifyToken, requireAdmin, StatsController.averageResolutionTime);
router.get("/monthly", verifyToken, requireAdmin, StatsController.monthlyEvolution);

export default router;
