import { Request, Response } from "express";
import { container } from "tsyringe";

import { RemoveGameFromListUseCase } from "@modules/games/useCases/removeGameFromList/RemoveGameFromListUseCase";

export async function removeGameFromListHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const { game_id } = request.params;
  const user_id = request.user.id;

  const removeGameUseCase = container.resolve(RemoveGameFromListUseCase);

  const update = await removeGameUseCase.execute(Number(game_id), user_id);

  return response.status(200).send(update);
}
