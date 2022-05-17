import { Request, Response } from "express";
import { container } from "tsyringe";

import { AddGameToListUseCase } from "@modules/games/useCases/addGameToList/AddGameToListUseCase";

export async function addGameToListHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const {
    id,
    cover_url,
    title,
    genre,
    score,
    status,
    involved_companies,
    platforms,
  } = request.body;

  const user_id = request.user.id;

  const addGameUseCase = container.resolve(AddGameToListUseCase);

  const kkkk = await addGameUseCase.execute({
    game: {
      id,
      cover_url,
      title,
      genre,
      score,
      status,
      involved_companies,
      platforms,
    },
    user_id,
  });

  return response.status(201).send(kkkk);
}
