import { Response, Request } from "express";
import { container } from "tsyringe";

import { UpdateGameFromListUseCase } from "@modules/games/useCases/updateGameFromList/UpdateGameFromListUseCase";

export async function updateGameFromListHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const game_id = Number(request.params.game_id);
  const user_id = request.user.id;
  const { score, status } = request.body;

  const useCase = container.resolve(UpdateGameFromListUseCase);

  const update = await useCase.execute({ game_id, user_id, score, status });

  return response.status(200).send(update);
}
