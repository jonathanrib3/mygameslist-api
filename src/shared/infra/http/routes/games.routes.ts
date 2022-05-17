import { Router } from "express";

import { addGameToListHandler } from "@modules/games/handlers/addGameToListHandler";
import { gameSearchHandler } from "@modules/games/handlers/gameSearchHandler";
import { removeGameFromListHandler } from "@modules/games/handlers/removeGameFromListHandler";
import { updateGameFromListHandler } from "@modules/games/handlers/updateGameFromListHandler";
import { authentication } from "@shared/infra/http/middlewares/authentication";

const gameRoutes = Router();

gameRoutes.delete("/:game_id", authentication, removeGameFromListHandler);
gameRoutes.patch("/:game_id", authentication, updateGameFromListHandler);
gameRoutes.post("/", authentication, addGameToListHandler);
gameRoutes.post("/search", gameSearchHandler);

export { gameRoutes };
