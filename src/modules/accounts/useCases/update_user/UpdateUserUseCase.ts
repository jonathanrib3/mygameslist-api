import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  UPDATE_INVALID_USER_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";
import { AppError } from "@shared/infra/errors/AppError";
import { passwordHashProvider } from "@shared/containers/providers/implementations/passwordHashProvider";

interface IRequest {
  id: string;
  username?: string;
  password?: string;
}

class UpdateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ id, username, password }: IRequest) {
    const userExists = await this.usersRepository.findById(id);

    if (!userExists) {
      throw new AppError(400, UPDATE_INVALID_USER_ERROR);
    }

    if (username) {
      const usernameAlreadyExists = await this.usersRepository.findByUsername(
        username
      );

      if (usernameAlreadyExists) {
        throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);
      }

      if (username.length < 4 || username.length > 35) {
        throw new AppError(400, USERNAME_LENGTH_ERROR);
      }
    }

    const hashedNewPassword = password
      ? await passwordHashProvider(password)
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