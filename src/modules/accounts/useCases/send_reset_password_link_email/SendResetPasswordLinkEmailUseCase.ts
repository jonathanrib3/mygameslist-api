import "@root/config.js";

import fs from "fs";
import { compile } from "handlebars";
import path from "path";
import { injectable } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { getResetPasswordEmailTextContent } from "@infra/smtp/templates/text_templates/reset_password_text_template";
import { IHtmlEmailContent } from "@modules/accounts/interfaces/IHtmlEmailContent";
import { User } from "@modules/accounts/models/User";
import { IResetPasswordSessionsRepository } from "@modules/accounts/repositories/IResetPasswordSessionsRepository";
import {
  EMAIL_NOT_SENT_ERROR,
  RESET_SESSION_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { EMAIL_OK_STATUS_RESPONSE_REGEX } from "@shared/constants/regexes";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";
import { INodemailerEmailSentData } from "@shared/containers/providers/interfaces/INodemailerEmailSentData";
import { ISESEmailSentData } from "@shared/containers/providers/interfaces/ISESEmailSentData";

interface IRequest {
  token_secret: string;
  user: User;
}

@injectable()
class SendResetPasswordLinkEmailUseCase {
  constructor(
    private sessionsRepository: IResetPasswordSessionsRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute({ token_secret, user }: IRequest): Promise<string> {
    const session = await this.sessionsRepository.findByUserId(user.id);
    const email_subject = "Reset Password Service";

    if (!session) {
      throw new AppError(400, RESET_SESSION_NOT_FOUND_ERROR);
    }

    const link = `${process.env.BASE_URL}/resetPassword?session=${session.id}`;

    const email_content = this.generateHtmlEmail({
      username: user.username,
      link,
      token_secret,
    });

    const text_content = getResetPasswordEmailTextContent({
      username: user.username,
      link,
      token_secret,
    });

    const email_sent_response_data = await this.mailProvider.sendEmail(
      email_content,
      user.email,
      email_subject,
      text_content
    );

    const { nodemailerEmailSentData, sesEmailSentData } =
      email_sent_response_data;

    this.validateEmailSentData(nodemailerEmailSentData, sesEmailSentData);

    return EMAIL_SUCCESSFULLY_SENT;
  }

  generateHtmlEmail({
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

  validateEmailSentData(
    nodemailerEmailSentData?: INodemailerEmailSentData,
    sesEmailSentData?: ISESEmailSentData
  ): void {
    if (nodemailerEmailSentData) {
      const { accepted, response } = nodemailerEmailSentData;

      if (
        !response.match(EMAIL_OK_STATUS_RESPONSE_REGEX) ||
        accepted.length === 0
      ) {
        throw new AppError(400, EMAIL_NOT_SENT_ERROR);
      }
    } else {
      const { statusCode, statusMessage } = sesEmailSentData;

      if (statusCode !== 200 || statusMessage !== "OK") {
        throw new AppError(400, EMAIL_NOT_SENT_ERROR);
      }
    }
  }
}

export { SendResetPasswordLinkEmailUseCase };
