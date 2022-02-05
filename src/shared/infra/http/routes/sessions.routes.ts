import { CreateSessionController } from "@modules/accounts/controllers/CreateSessionController";
import { Router } from "express";

const sessionRoutes = Router();
const createSessionController = new CreateSessionController();

sessionRoutes.post("/", createSessionController.handle);

export { sessionRoutes };
