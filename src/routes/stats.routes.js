import { Router } from "express";
import StatsController from "../controllers/StatsController.js";
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get(
	"/occurrences-by-category",
	verifyToken,
	requireAdmin,
	StatsController.occurrencesByCategory
);
router.get(
	"/occurrences-by-status",
	verifyToken,
	requireAdmin,
	StatsController.occurrencesByStatus
);
router.get(
	"/occurrences-by-building",
	verifyToken,
	requireAdmin,
	StatsController.occurrencesByBuilding
);
router.get(
	"/average-resolution-time",
	verifyToken,
	requireAdmin,
	StatsController.averageResolutionTime
);
router.get(
	"/monthly-evolution",
	verifyToken,
	requireAdmin,
	StatsController.monthlyEvolution
);

export default router;
