import { AppError } from "@infra/errors/AppError";
import { ISessionsRepository } from "@modules/accounts/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";

class CreateResetSessionUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private sessionsRepository: ISessionsRepository
  ) {}

  async execute(user_id: string): Promise<string> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND_ERROR);
    }

    const result = await this.sessionsRepository.create(user_id);

    return result;
  }
}

export { CreateResetSessionUseCase };
