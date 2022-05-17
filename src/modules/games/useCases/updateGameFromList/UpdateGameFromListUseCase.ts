import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IGame } from "@modules/games/interfaces/IGame";
import { transformCurrentStatusFromStringToEnum } from "@modules/games/useCases/utils/transformCurrentStatusFromStringToEnum";

interface IRequest {
  user_id: string;
  game_id: number;
  score?: number;
  status?: string;
}

@injectable()
class UpdateGameFromListUseCase {
  constructor(
    @inject("MongoUsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    user_id,
    game_id,
    status,
    score,
  }: IRequest): Promise<IGame[]> {
    let formatted_status: string;

    if (status) {
      formatted_status = transformCurrentStatusFromStringToEnum(
        status.toLowerCase()
      );
    }

    const update = await this.usersRepository.updateGameFromList({
      user_id,
      game_id,
      score,
      status: formatted_status,
    });

    return update;
  }
}

export { UpdateGameFromListUseCase };
