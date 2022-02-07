import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { UPDATE_INVALID_USER_ERROR } from "@shared/constants/error_messages";
import { AppError } from "@shared/infra/errors/AppError";

interface IRequest {
  user_id: string;
  filename: string;
}

@injectable()
class UploadAvatarUseCase {
  constructor(
    @inject("UsersTestRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, filename }: IRequest) {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError(400, UPDATE_INVALID_USER_ERROR);
    }

    const update = await this.usersRepository.updateAvatar(user_id, filename);

    return update;
  }
}

export { UploadAvatarUseCase };
