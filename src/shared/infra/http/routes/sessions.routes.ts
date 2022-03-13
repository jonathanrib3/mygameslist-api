import { createAuthSessionHandler } from "@modules/accounts/controllers/createAuthSessionHandler";
import { Router } from "express";

const sessionRoutes = Router();

sessionRoutes.post("/", createAuthSessionHandler);

export { sessionRoutes };
