import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { User } from "@modules/accounts/models/User";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  EXPIRED_TOKEN_ERROR,
  TOKEN_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";

@injectable()
class ResetPasswordUseCase {
  constructor(
    @inject("TokensTestRepository")
    private tokensRepository: ITokensRepository,
    @inject("UsersTestRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(hashed_token_id: string, password: string): Promise<User> {
    const found_token = await this.tokensRepository.findByToken(
      hashed_token_id
    );

    if (!found_token) {
      throw new AppError(401, TOKEN_NOT_FOUND_ERROR);
    }

    if (new Date().getTime() > found_token.expires_in) {
      throw new AppError(401, EXPIRED_TOKEN_ERROR);
    }

    const new_hashed_password = bcrypt.hashSync(
      password,
      Number(process.env.BCRYPT_SALT)
    );

    const update = await this.usersRepository.update({
      id: found_token.user_id,
      password: new_hashed_password,
    });

    return update;
  }
}

export { ResetPasswordUseCase };
