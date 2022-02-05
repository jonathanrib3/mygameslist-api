import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/models/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";
import { AppError } from "@shared/infra/errors/AppError";
import { passwordHashProvider } from "@shared/containers/providers/implementations/passwordHashProvider";

interface IRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersTestRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    username,
    email,
    password,
    avatar,
  }: IRequest): Promise<User> {
    const emailAlreadyBeingUsed = await this.usersRepository.findByEmail(email);

    if (emailAlreadyBeingUsed) {
      throw new AppError(400, EMAIL_ALREADY_EXISTS_ERROR);
    }

    const usernameAlreadyBeingUsed = await this.usersRepository.findByUsername(
      username
    );

    if (usernameAlreadyBeingUsed) {
      throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);
    }

    if (username.length < 4 || username.length > 35) {
      throw new AppError(400, USERNAME_LENGTH_ERROR);
    }

    const hashedPassword = await passwordHashProvider(password);

    const user = await this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    return user;
  }
}

export { CreateUserUseCase };
