import "../../../../../config.js";

import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";

import { User } from "@modules/accounts/models/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { USERNAME_LENGTH_ERROR } from "@shared/constants/error_messages";
import { AppError } from "@shared/infra/errors/AppError";

interface IRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("MongoUsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    username,
    email,
    password,
    avatar,
  }: IRequest): Promise<User> {
    if (this.isUsernameLengthValid(username)) {
      throw new AppError(400, USERNAME_LENGTH_ERROR);
    }

    const hashedPassword = await bcrypt.hashSync(
      password,
      Number(process.env.BCRYPT_SALT)
    );

    const user = await this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    return user;
  }

  isUsernameLengthValid(username: string): boolean {
    return username.length < 4 || username.length > 35;
  }
}

export { CreateUserUseCase };
