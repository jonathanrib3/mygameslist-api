import "../../../../../config.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { compile } from "handlebars";
import path from "path";

import { AppError } from "@infra/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  EMAIL_NOT_SENT_ERROR,
  USER_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { EMAIL_OK_STATUS_RESPONSE_REGEX } from "@shared/constants/regexes";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";
import { inject, injectable } from "tsyringe";

interface IRequest {
  token_id: string;
  user_id: string;
}

@injectable()
class SendResetPasswordLinkEmailUseCase {
  constructor(
    @inject("UsersTestRepository")
    private usersRepository: IUsersRepository,
    @inject("NodeMailerMailProvider")
    private mailProvider: IMailProvider
  ) {}

  async execute({ token_id, user_id }: IRequest): Promise<string> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND_ERROR);
    }

    const link = `${process.env.BASE_URL}/resetPassword?token=${bcrypt.hashSync(
      token_id,
      Number(process.env.BCRYPT_SALT)
    )}`;

    const email_content = this.generateHtmlEmail(user.username, link);

    const email_sent_response_data = await this.mailProvider.sendEmail<string>(
      email_content,
      user.email,
      "Reset Password Service"
    );

    const { accepted, rejected, response } = email_sent_response_data;

    if (
      !response.match(EMAIL_OK_STATUS_RESPONSE_REGEX) ||
      accepted.length === 0 ||
      rejected.length > 0
    ) {
      throw new AppError(400, EMAIL_NOT_SENT_ERROR);
    }

    return EMAIL_SUCCESSFULLY_SENT;
  }

  private generateHtmlEmail(username: string, link: string) {
    const htmlTemplateSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "./shared/infra/smtp/templates/reset_password_template.hbs"
      ),
      "utf-8"
    );

    const template = compile(htmlTemplateSource);

    return template({ username, link });
  }
}

export { SendResetPasswordLinkEmailUseCase };
