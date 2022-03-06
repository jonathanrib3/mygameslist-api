import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

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
    const update = await this.usersRepository.updateAvatar(user_id, filename);

    return update;
  }
}

export { UploadAvatarUseCase };
