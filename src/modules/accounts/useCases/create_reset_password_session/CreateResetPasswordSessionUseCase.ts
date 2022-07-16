import bcrypt from "bcrypt";
import "@root/config.js";
import { injectable } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { ResetPasswordSession } from "@modules/accounts/models/ResetPasswordSession";
import { IResetPasswordSessionsRepository } from "@modules/accounts/repositories/IResetPasswordSessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { SendResetPasswordLinkEmailUseCase } from "@modules/accounts/useCases/send_reset_password_link_email/SendResetPasswordLinkEmailUseCase";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";

const MIN = Number(process.env.MIN_TOKEN_SECRET);
const MAX = Number(process.env.MAX_TOKEN_SECRET);

@injectable()
class CreateResetPasswordSessionUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private sessionsRepository: IResetPasswordSessionsRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<ResetPasswordSession> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND_ERROR);
    }

    const token_secret = this.generateRandomTokenSecret();

    const hashed_token_secret = bcrypt.hashSync(
      token_secret,
      Number(process.env.BCRYPT_SALT)
    );

    const result = await this.sessionsRepository.create(
      user.id,
      hashed_token_secret
    );

    const sendResetPasswordLinkEmailUseCase =
      new SendResetPasswordLinkEmailUseCase(
        this.sessionsRepository,
        this.mailProvider
      );

    await sendResetPasswordLinkEmailUseCase.execute({
      token_secret,
      user,
    });

    return result;
  }

  generateRandomTokenSecret(): string {
    const token_secret = Math.floor(Math.random() * (MAX - MIN) + MIN);

    return String(token_secret);
  }
}

export { CreateResetPasswordSessionUseCase };
