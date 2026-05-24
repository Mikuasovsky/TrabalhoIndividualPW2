import { Router } from "express";
import StatusController from "../controllers/StatusController.js";

const router = Router();

router.post("/", StatusController.create);
router.get("/", StatusController.getAll);
router.get("/:id", StatusController.getById);
router.put("/:id", StatusController.update);
router.delete("/:id", StatusController.delete);

export default router;
