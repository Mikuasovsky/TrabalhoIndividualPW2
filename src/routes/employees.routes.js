import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController.js";
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/", EmployeeController.create);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);
router.patch("/:id", verifyToken, requireAdmin, EmployeeController.validate);

export default router;
