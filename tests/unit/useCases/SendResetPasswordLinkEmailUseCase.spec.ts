import { ResetPasswordSessionsTestRepository } from "@modules/accounts/repositories/implementations/in-memory/ResetPasswordSessionsTestRepository";
import { SendResetPasswordLinkEmailUseCase } from "@modules/accounts/useCases/send_reset_password_link_email/SendResetPasswordLinkEmailUseCase";
import { session } from "@root/tests/dummies/default_session_dummy";
import {
  EMAIL_NOT_SENT_ERROR,
  RESET_SESSION_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { IEMailSentDTO } from "@shared/containers/providers/dtos/IEmailSentDTO";
import { NodeMailerMailProvider } from "@shared/containers/providers/implementations/NodeMailerMailProvider";

import { user } from "../../dummies/default_user_dummy";

describe("send reset password email unit tests", () => {
  let resetPasswordSessionsTestRepository: ResetPasswordSessionsTestRepository;
  let nodemailerMailProvider: NodeMailerMailProvider;
  let sendResetPasswordLinkEmail: SendResetPasswordLinkEmailUseCase;

  beforeAll(async () => {
    resetPasswordSessionsTestRepository =
      new ResetPasswordSessionsTestRepository();
    nodemailerMailProvider = new NodeMailerMailProvider();

    sendResetPasswordLinkEmail = new SendResetPasswordLinkEmailUseCase(
      resetPasswordSessionsTestRepository,
      nodemailerMailProvider
    );
  });

  it("should be able to send an email with reset password link to user", async () => {
    // Arrange
    const { token_secret } = session.token;
    const expected_email_sent_data: IEMailSentDTO = {
      nodemailerEmailSentData: {
        response: "250 Accepted",
        accepted: ["someemail@email.com"],
      },
    };
    jest
      .spyOn(resetPasswordSessionsTestRepository, "findByUserId")
      .mockReturnValue(Promise.resolve(session));

    jest
      .spyOn(nodemailerMailProvider, "sendEmail")
      .mockReturnValue(Promise.resolve(expected_email_sent_data));

    // Act

    const result = await sendResetPasswordLinkEmail.execute({
      token_secret,
      user,
    });

    // Assert

    expect(result).toEqual(EMAIL_SUCCESSFULLY_SENT);
  });

  it("should not be able to send an email when there is no session created", async () => {
    // Arrange
    const { token_secret } = session.token;

    jest
      .spyOn(resetPasswordSessionsTestRepository, "findByUserId")
      .mockReturnValue(undefined);

    expect(async () => {
      // Act;

      await sendResetPasswordLinkEmail.execute({
        token_secret,
        user,
      });
      // Assert
    }).rejects.toThrow(RESET_SESSION_NOT_FOUND_ERROR);
  });

  it("should throw an error when sendEmail output is from nodemailer and the response is different from '250 Accepted'", async () => {
    // Arrange
    const { token_secret } = session.token;
    const expected_email_sent_data: IEMailSentDTO = {
      nodemailerEmailSentData: {
        response: "Something went wrong",
        accepted: [],
      },
    };

    jest
      .spyOn(resetPasswordSessionsTestRepository, "findByUserId")
      .mockReturnValue(Promise.resolve(session));

    jest
      .spyOn(nodemailerMailProvider, "sendEmail")
      .mockReturnValue(Promise.resolve(expected_email_sent_data));

    expect(async () => {
      // Act

      await sendResetPasswordLinkEmail.execute({ token_secret, user });
      // Assert
    }).rejects.toThrow(EMAIL_NOT_SENT_ERROR);
  });

  it("should throw an error when sendEmail output is from SES and status code is different from 200", async () => {
    // Arrange
    const { token_secret } = session.token;
    const expected_email_sent_data: IEMailSentDTO = {
      sesEmailSentData: {
        statusCode: 400,
        statusMessage: "BAD GATEWAY",
        messageId: "some id",
      },
    };

    jest
      .spyOn(resetPasswordSessionsTestRepository, "findByUserId")
      .mockReturnValue(Promise.resolve(session));

    jest
      .spyOn(nodemailerMailProvider, "sendEmail")
      .mockReturnValue(Promise.resolve(expected_email_sent_data));

    expect(async () => {
      // Act

      await sendResetPasswordLinkEmail.execute({ token_secret, user });
      // Assert
    }).rejects.toThrow(EMAIL_NOT_SENT_ERROR);
  });
});
