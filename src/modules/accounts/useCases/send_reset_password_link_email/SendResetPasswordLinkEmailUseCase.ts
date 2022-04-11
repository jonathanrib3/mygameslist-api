import "../../../../../config.js";

import fs from "fs";
import { compile } from "handlebars";
import path from "path";
import { inject, injectable } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { IHtmlEmailContent } from "@modules/accounts/interfaces/IHtmlEmailContent";
import { ISessionsRepository } from "@modules/accounts/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  EMAIL_NOT_SENT_ERROR,
  SESSION_NOT_FOUND_ERROR,
  USER_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { EMAIL_OK_STATUS_RESPONSE_REGEX } from "@shared/constants/regexes";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";

interface IRequest {
  token_secret: string;
  email: string;
}

@injectable()
class SendResetPasswordLinkEmailUseCase {
  constructor(
    @inject("MongoUsersRepository")
    private usersRepository: IUsersRepository,
    @inject("MongoResetSessionsRepository")
    private sessionsRepository: ISessionsRepository,
    @inject("NodeMailerMailProvider")
    private mailProvider: IMailProvider
  ) {}

  async execute({ token_secret, email }: IRequest): Promise<string> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND_ERROR);
    }

    const session = await this.sessionsRepository.findByUserId(user.id);

    if (!session) {
      throw new AppError(400, SESSION_NOT_FOUND_ERROR);
    }

    const link = `${process.env.BASE_URL}/resetPassword?session=${session.id}`;

    const email_content = this.generateHtmlEmail({
      username: user.username,
      link,
      token_secret,
    });

    const email_sent_response_data = await this.mailProvider.sendEmail<string>(
      email_content,
      email,
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

  private generateHtmlEmail({
    username,
    link,
    token_secret,
  }: IHtmlEmailContent): string {
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

    return template({ username, link, token_secret });
  }
}

export { SendResetPasswordLinkEmailUseCase };
