import { Router } from "express";

import { createResetSessionHandler } from "@modules/accounts/controllers/createResetSessionHandler";
import { resetPasswordHandler } from "@modules/accounts/controllers/resetPasswordHandler";

const resetSessionsRoutes = Router();

resetSessionsRoutes.post("/", createResetSessionHandler);
resetSessionsRoutes.patch("/resetPassword", resetPasswordHandler);

export { resetSessionsRoutes };
