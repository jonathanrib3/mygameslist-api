import "../../../../../config.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { compile } from "handlebars";
import path from "path";

import { AppError } from "@infra/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";

interface IRequest {
  token: string;
  user_id: string;
}

interface IResponse {
  accepted: string[];
  rejected: string[];
  response: string;
}

class SendResetPasswordLinkEmailUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute({ token, user_id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND_ERROR);
    }

    const link = `${process.env.BASE_URL}/resetPassword?token=${bcrypt.hashSync(
      token,
      Number(process.env.BCRYPT_SALT)
    )}`;

    const email_content = this.generateHtmlEmail(user.username, link);

    const email_sent_response_data = await this.mailProvider.sendEmail<string>(
      email_content,
      user.email,
      "Reset Password Service"
    );

    return email_sent_response_data;
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
