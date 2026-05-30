import { Router } from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./users.routes.js";
import employeeRoutes from "./employees.routes.js";
import categoryRoutes from "./categories.routes.js";
import statusRoutes from "./statuses.routes.js";
import locationRoutes from "./locations.routes.js";
import occurrenceRoutes from "./occurrences.routes.js";
import commentRoutes from "./comments.routes.js";
import statsRoutes from "./stats.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/employees", employeeRoutes);
router.use("/categories", categoryRoutes);
router.use("/statuses", statusRoutes);
router.use("/locations", locationRoutes);
router.use("/occurrences", occurrenceRoutes);
router.use("/comments", commentRoutes);
router.use("/statistics", statsRoutes);

export default router;
