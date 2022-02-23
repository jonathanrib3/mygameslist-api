import crypto from "crypto";

import { AppError } from "@infra/errors/AppError";
import { ITokensRepository } from "@modules/accounts/repositories/ITokensRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";
import { TOKEN_RANDOM_BYTES } from "@shared/constants/numeric_constants";

interface IResponse {
  token: string;
  user_id: string;
}

class CreateResetPasswordTokenUseCase {
  constructor(
    private tokensRepository: ITokensRepository,
    private usersRepository: IUsersRepository
  ) {}

  async execute(email: string): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND_ERROR);
    }

    const token = crypto.randomBytes(TOKEN_RANDOM_BYTES).toString("hex");

    await this.tokensRepository.create(token, user.id);

    return {
      token,
      user_id: user.id,
    };
  }
}

export { CreateResetPasswordTokenUseCase };
