import { Router } from "express";

import userRoutes from "./users.routes.js";
import employeeRoutes from "./employees.routes.js";
import categoryRoutes from "./categories.routes.js";
import statusRoutes from "./statuses.routes.js";
import locationRoutes from "./locations.routes.js";
import occurrenceRoutes from "./occurrences.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/employees", employeeRoutes);
router.use("/categories", categoryRoutes);
router.use("/statuses", statusRoutes);
router.use("/locations", locationRoutes);
router.use("/occurrences", occurrenceRoutes);

export default router;
