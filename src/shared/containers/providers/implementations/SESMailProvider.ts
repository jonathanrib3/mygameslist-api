import { ses_instance } from "@infra/aws/aws_ses";
import { AppError } from "@infra/errors/AppError";
import { EMAIL_NOT_SENT_ERROR } from "@shared/constants/error_messages";
import { IEMailSentDTO } from "@shared/containers/providers/dtos/IEmailSentDTO";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";

export class SESMailProvider implements IMailProvider {
  private DEFAULT_CONTENT_CHARSET = "UTF-8";

  async sendEmail(
    html_message_data: string,
    user_email: string,
    subject: string,
    text_message_data?: string
  ): Promise<IEMailSentDTO> {
    const email = await ses_instance
      .sendEmail(
        {
          Source: process.env.DEFAULT_EMAIL_SENDER.trim(),
          Destination: {
            ToAddresses: [user_email],
          },
          Message: {
            Body: {
              Html: {
                Charset: this.DEFAULT_CONTENT_CHARSET,
                Data: html_message_data,
              },
              Text: {
                Charset: this.DEFAULT_CONTENT_CHARSET,
                Data: text_message_data,
              },
            },
            Subject: {
              Charset: this.DEFAULT_CONTENT_CHARSET,
              Data: subject,
            },
          },
        },
        (err, data) => {
          if (err) {
            console.log(err);
            throw new AppError(400, EMAIL_NOT_SENT_ERROR);
          }
          return data;
        }
      )
      .promise();

    const { statusCode, statusMessage } = email.$response.httpResponse;

    const emailSentData: IEMailSentDTO = {
      sesEmailSentData: {
        messageId: email.MessageId,
        statusCode,
        statusMessage,
      },
    };

    return emailSentData;
  }
}
