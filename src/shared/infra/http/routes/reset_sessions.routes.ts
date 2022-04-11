import { Router } from "express";

import { createResetSessionHandler } from "@modules/accounts/controllers/createResetSessionHandler";

const resetSessionsRoutes = Router();

resetSessionsRoutes.post("/", createResetSessionHandler);

export { resetSessionsRoutes };
