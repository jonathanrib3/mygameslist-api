import "../../../../../config.js";
import crypto from "crypto";
import { inject, injectable } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";

interface IResponse {
  token_id: string;
  user_id: string;
}

@injectable()
class CreateResetPasswordTokenUseCase {
  constructor(
    @inject("TokensTestRepository")
    private tokensRepository: ITokensRepository,
    @inject("UsersTestRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(email: string): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND_ERROR);
    }

    const token_id = crypto
      .randomBytes(Number(process.env.TOKEN_RANDOM_BYTES))
      .toString("hex");

    const created_token = await this.tokensRepository.create(token_id, user.id);

    return created_token;
  }
}

export { CreateResetPasswordTokenUseCase };
