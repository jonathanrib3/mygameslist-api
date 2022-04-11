import { AppError } from "@infra/errors/AppError";
import { IHtmlEmailContent } from "@modules/accounts/interfaces/IHtmlEmailContent";
import { ISessionsRepository } from "@modules/accounts/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  EMAIL_NOT_SENT_ERROR,
  USER_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { EMAIL_OK_STATUS_RESPONSE_REGEX } from "@shared/constants/regexes";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";

interface IRequest {
  token_secret: string;
  email: string;
}

class SendResetPasswordLinkEmailUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private resetSessionsRepository: ISessionsRepository,
    private mailProvider: IMailProvider
  ) {}

  async execute({ token_secret, email }: IRequest): Promise<string> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, USER_NOT_FOUND_ERROR);
    }

    const session = await this.resetSessionsRepository.findByUserId(user.id);

    const link = `${process.env.BASE_URL}/resetPassword?session=${session.id}`;

    const email_content = this.generateHtmlEmail({
      username: user.username,
      link,
      token_secret,
    });

    const email_sent_response_data = await this.mailProvider.sendEmail<string>(
      email_content,
      user.email,
      "Reset Password Service"
    );

    const { response } = email_sent_response_data;

    if (!response.match(EMAIL_OK_STATUS_RESPONSE_REGEX)) {
      throw new AppError(400, EMAIL_NOT_SENT_ERROR);
    }

    return EMAIL_SUCCESSFULLY_SENT;
  }

  private generateHtmlEmail({
    username,
    link,
    token_secret,
  }: IHtmlEmailContent): string {
    return `<p>Hello, ${username}, here's your link and secret token: ${link} <br><strong>${token_secret}</strong></p>`;
  }
}

export { SendResetPasswordLinkEmailUseCase };
