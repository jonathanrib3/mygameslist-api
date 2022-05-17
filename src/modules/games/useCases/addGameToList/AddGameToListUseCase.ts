import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IGame } from "@modules/games/interfaces/IGame";
import { transformCurrentStatusFromStringToEnum } from "@modules/games/useCases/utils/transformCurrentStatusFromStringToEnum";

interface IRequest {
  game: IGame;
  user_id: string;
}

@injectable()
class AddGameToListUseCase {
  constructor(
    @inject("MongoUsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ game, user_id }: IRequest): Promise<IGame[]> {
    const {
      cover_url,
      genre,
      id,
      involved_companies,
      platforms,
      score,
      status,
      title,
    } = game;

    const formatted_game: IGame = {
      cover_url,
      genre,
      id,
      involved_companies,
      platforms,
      score,
      status: transformCurrentStatusFromStringToEnum(status.toLowerCase()),
      title,
    };

    const updated_list = await this.usersRepository.addGameToList({
      game: formatted_game,
      user_id,
    });

    return updated_list;
  }
}

export { AddGameToListUseCase };
