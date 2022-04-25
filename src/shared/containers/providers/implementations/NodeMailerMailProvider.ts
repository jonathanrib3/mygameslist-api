import { transporter } from "@infra/smtp/smtp_transporter";
import { IEMailSentDTO } from "@shared/containers/providers/dtos/IEmailSentDTO";

import { IMailProvider } from "../IMailProvider";

class NodeMailerMailProvider implements IMailProvider {
  private mail_transporter = transporter;

  async sendEmail<ContentType>(
    message_data: ContentType,
    user_email: string,
    subject: string
  ): Promise<IEMailSentDTO> {
    const email = await this.mail_transporter.sendMail({
      from: process.env.DEFAULT_EMAIL_SENDER_ADDRESS,
      to: user_email,
      date: new Date().toUTCString(),
      subject,
      html: message_data,
    });

    const emailSentData: IEMailSentDTO = {
      nodemailerEmailSentData: {
        accepted: email.accepted as string[],
        response: email.response as string,
      },
    };

    return emailSentData;
  }
}

export { NodeMailerMailProvider };
