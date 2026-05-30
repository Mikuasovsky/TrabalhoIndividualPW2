import { Router } from "express";
import LocationController from "../controllers/LocationController.js";
import { requireAnyRole, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/", verifyToken, LocationController.create);
router.get("/", verifyToken, LocationController.getAll);
router.get("/:id", verifyToken, LocationController.getById);
router.put(
	"/:id",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	LocationController.update
);
router.delete(
	"/:id",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	LocationController.delete
);

export default router;
