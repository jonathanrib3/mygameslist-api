import "@root/config.js";
import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { User } from "@modules/accounts/models/User";
import { ISessionsRepository } from "@modules/accounts/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  INVALID_RESET_TOKEN_ERROR,
  RESET_SESSION_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";

interface IRequest {
  session_id;
  token_secret;
  new_password;
}

@injectable()
class ResetPasswordUseCase {
  constructor(
    @inject("MongoResetSessionsRepository")
    private sessionsRepository: ISessionsRepository,
    @inject("MongoUsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    session_id,
    token_secret,
    new_password,
  }: IRequest): Promise<User> {
    const session = await this.sessionsRepository.findById(session_id);

    if (!session) {
      throw new AppError(401, RESET_SESSION_NOT_FOUND_ERROR);
    }

    const hashed_token_secret = session.token.token_secret;

    const is_token_correct = bcrypt.compareSync(
      token_secret,
      hashed_token_secret
    );

    if (!is_token_correct) {
      throw new AppError(401, INVALID_RESET_TOKEN_ERROR);
    }

    const hashed_password = bcrypt.hashSync(
      new_password,
      Number(process.env.BCRYPT_SALT)
    );

    const update = await this.usersRepository.update({
      id: session.user_id,
      password: hashed_password,
    });

    return update;
  }
}

export { ResetPasswordUseCase };
