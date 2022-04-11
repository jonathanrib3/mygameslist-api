import { ResetSessionsTestRepository } from "@modules/accounts/repositories/implementations/in-memory/ResetSessionsTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { session } from "@root/tests/dummies/default_session_dummy";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { NodeMailerMailProvider } from "@shared/containers/providers/implementations/NodeMailerMailProvider";

import { user } from "../../dummies/default_user_dummy";
import { SendResetPasswordLinkEmailUseCase } from "./__mocks__/SendResetPasswordLinkEmailUseCase";

jest.mock(
  "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository"
);
jest.mock(
  "@shared/containers/providers/implementations/NodeMailerMailProvider"
);

describe("send reset password email unit tests", () => {
  let usersTestRepository: UsersTestRepository;
  let resetSessionsTestRepository: ResetSessionsTestRepository;
  let nodemailerMailProvider: NodeMailerMailProvider;
  let sendResetPasswordLinkEmail: SendResetPasswordLinkEmailUseCase;

  beforeAll(async () => {
    usersTestRepository = new UsersTestRepository();
    resetSessionsTestRepository = new ResetSessionsTestRepository();
    nodemailerMailProvider = new NodeMailerMailProvider();

    sendResetPasswordLinkEmail = new SendResetPasswordLinkEmailUseCase(
      usersTestRepository,
      resetSessionsTestRepository,
      nodemailerMailProvider
    );
  });

  it("should be able to send an email with reset password link to user", async () => {
    // Arrange
    const { email } = user;
    const { token_secret } = session.token;

    (<jest.Mock>usersTestRepository.findByEmail).mockReturnValue(user);

    jest
      .spyOn(resetSessionsTestRepository, "findByUserId")
      .mockReturnValue(Promise.resolve(session));

    (<jest.Mock>nodemailerMailProvider.sendEmail).mockReturnValue({
      response: "250 Accepted",
    });

    // Act

    const result = await sendResetPasswordLinkEmail.execute({
      token_secret,
      email,
    });

    // Assert

    expect(result).toEqual(EMAIL_SUCCESSFULLY_SENT);
  });

  it("should not be able to send email with invalid user id", async () => {
    // Arrange
    const { token_secret } = session.token;
    const { email } = user;

    (<jest.Mock>usersTestRepository.findByEmail).mockReturnValue(undefined);

    expect(async () => {
      // Act;

      await sendResetPasswordLinkEmail.execute({
        token_secret,
        email,
      });
      // Assert
    }).rejects.toThrow(USER_NOT_FOUND_ERROR);
  });
});
