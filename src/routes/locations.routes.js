// Importação do Router do Express
import { Router } from "express";
// Importação do controller de locais
import LocationController from "../controllers/LocationController.js";
// Importação dos middlewares de autenticação e autorização
import { requireAnyRole, verifyToken } from "../middlewares/auth.js";

const router = Router();

// CRUD de locais (admin/employee)
router.post("/", verifyToken, requireAnyRole(["employee", "admin"]), LocationController.create);
router.get("/", verifyToken, requireAnyRole(["employee", "admin"]), LocationController.getAll);
router.get("/:id", verifyToken, requireAnyRole(["employee", "admin"]), LocationController.getById);
// Atualizar local (employee ou admin)
router.put(
	"/:id",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	LocationController.update
);
// Apagar local (employee ou admin)
router.delete(
	"/:id",
	verifyToken,
	requireAnyRole(["employee", "admin"]),
	LocationController.delete
);

export default router;
