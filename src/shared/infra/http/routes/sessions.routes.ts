import { Router } from "express";

import { createAuthSessionHandler } from "@modules/accounts/controllers/createAuthSessionHandler";

const sessionRoutes = Router();

sessionRoutes.post("/", createAuthSessionHandler);

export { sessionRoutes };
