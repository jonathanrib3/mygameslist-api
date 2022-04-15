import { Router } from "express";

import { resetPasswordHandler } from "@modules/accounts/controllers/resetPasswordHandler";

const resetPasswordRoutes = Router();

resetPasswordRoutes.patch("/", resetPasswordHandler);

export { resetPasswordRoutes };
