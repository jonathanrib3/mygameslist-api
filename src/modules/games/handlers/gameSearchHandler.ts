import { Response, Request } from "express";
import { container } from "tsyringe";

import { GameSearchUseCase } from "@modules/games/useCases/searchGameUseCase/GameSearchUseCase";

export async function gameSearchHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const { game_name, offset } = request.body;

  const gameSearchUseCase = container.resolve(GameSearchUseCase);

  const game_data = await gameSearchUseCase.execute(
    game_name as string,
    offset
  );

  return response.status(200).send(game_data);
}
