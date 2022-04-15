import { Router } from "express";

import { resetPasswordRoutes } from "@infra/http/routes/reset_password.routes";
import { resetSessionsRoutes } from "@infra/http/routes/reset_sessions.routes";

import { sessionRoutes } from "./sessions.routes";
import { userRoutes } from "./user.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);
router.use("/resetSessions", resetSessionsRoutes);
router.use("/resetPassword", resetPasswordRoutes);

export { router };
