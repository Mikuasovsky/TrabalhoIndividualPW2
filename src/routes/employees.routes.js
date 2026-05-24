import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController.js";

const router = Router();

router.post("/", EmployeeController.create);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);

export default router;
