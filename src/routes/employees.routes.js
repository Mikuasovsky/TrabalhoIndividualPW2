// Importação do Router do Express
import { Router } from "express";
// Importação do controller de funcionários
import EmployeeController from "../controllers/EmployeeController.js";
// Importação dos middlewares de autenticação e autorização
import { requireAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

// CRUD de funcionários (admin only)
router.post("/", EmployeeController.create);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);
// Validar funcionário (sub-resource RESTful, admin only)
router.put("/:id/validate", verifyToken, requireAdmin, EmployeeController.validate);

export default router;
