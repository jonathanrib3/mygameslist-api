import { IEMailSentDTO } from "./dtos/IEmailSentDTO";

interface IMailProvider {
  sendEmail(
    html_message_data: string,
    user_email: string,
    subject: string,
    text_message_data?: string
  ): Promise<IEMailSentDTO>;
}

export { IMailProvider };
