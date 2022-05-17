import { Router } from "express";

import { createResetPasswordSessionHandler } from "@modules/accounts/controllers/createResetPasswordSessionHandler";
import { resetPasswordHandler } from "@modules/accounts/controllers/resetPasswordHandler";

const resetPasswordSessionsRoutes = Router();

resetPasswordSessionsRoutes.post("/", createResetPasswordSessionHandler);
resetPasswordSessionsRoutes.patch("/resetPassword", resetPasswordHandler);

export { resetPasswordSessionsRoutes };
