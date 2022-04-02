import "@root/config.js";

import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/models/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { USERNAME_LENGTH_ERROR } from "@shared/constants/error_messages";
import { AppError } from "@shared/infra/errors/AppError";

interface IRequest {
  id: string;
  username?: string;
  password?: string;
}

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersTestRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ id, username, password }: IRequest): Promise<User> {
    if (
      (username && username.length < 4) ||
      (username && username.length > 35)
    ) {
      throw new AppError(400, USERNAME_LENGTH_ERROR);
    }
    const hashedNewPassword = password
      ? bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT))
      : undefined;

    const update = await this.usersRepository.update({
      id,
      username,
      password: hashedNewPassword,
    });

    return update;
  }
}

export { UpdateUserUseCase };
