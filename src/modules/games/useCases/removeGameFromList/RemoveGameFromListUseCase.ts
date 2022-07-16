import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IGame } from "@modules/games/interfaces/IGame";

@injectable()
class RemoveGameFromListUseCase {
  constructor(
    @inject("MongoUsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(game_id: number, user_id: string): Promise<IGame[]> {
    const list = await this.usersRepository.removeGameFromList(
      game_id,
      user_id
    );

    return list;
  }
}

export { RemoveGameFromListUseCase };
