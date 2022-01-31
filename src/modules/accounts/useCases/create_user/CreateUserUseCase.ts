import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/models/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
} from "@shared/constants/string_constants";
import { AppError } from "@shared/infra/errors/AppError";
import { passwordHashProvider } from "@shared/providers/implementations/passwordHashProvider";

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
    const emailAlreadyBeingUsed = this.usersRepository.findByEmail(email);

    if (emailAlreadyBeingUsed) {
      throw new AppError(400, EMAIL_ALREADY_EXISTS_ERROR);
    }

    const usernameAlreadyBeingUsed =
      this.usersRepository.findByUsername(username);

    if (usernameAlreadyBeingUsed) {
      throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);
    }

    const hashedPassword = await passwordHashProvider(password);

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    return user;
  }
}

export { CreateUserUseCase };
