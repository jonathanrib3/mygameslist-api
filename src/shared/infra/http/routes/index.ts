import { Router } from "express";
import { sessionRoutes } from "./sessions.routes";

import { userRoutes } from "./user.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);

export { router };
