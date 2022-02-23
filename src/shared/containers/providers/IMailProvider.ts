import { IEMailSentDTO } from "./dtos/IEmailSentDTO";

interface IMailProvider {
  sendEmail<ContentType>(
    message_data: ContentType,
    user_email: string,
    subject: string
  ): Promise<IEMailSentDTO>;
}

export { IMailProvider };
