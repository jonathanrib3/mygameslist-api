import { Router } from "express";

import { gameSearchHandler } from "@modules/games/handlers/gameSearchHandler";

const gameRoutes = Router();

gameRoutes.post("/search", gameSearchHandler);

export { gameRoutes };
