import crypto from "crypto";
import { v4 } from "uuid";

import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { NodeMailerMailProvider } from "@shared/containers/providers/implementations/NodeMailerMailProvider";

import { SendResetPasswordLinkEmailUseCase } from "./__mocks__/SendResetPasswordLinkEmailUseCase";
import { user } from "../../dummies/default_user_dummy";

jest.mock("@modules/accounts/repositories/in-memory/UsersTestRepository");
jest.mock(
  "@shared/containers/providers/implementations/NodeMailerMailProvider"
);

describe("send reset password email unit tests", () => {
  let usersTestRepository: UsersTestRepository;
  let nodemailerMailProvider: NodeMailerMailProvider;
  let sendResetPasswordLinkEmail: SendResetPasswordLinkEmailUseCase;

  beforeAll(async () => {
    usersTestRepository = new UsersTestRepository();
    nodemailerMailProvider = new NodeMailerMailProvider();

    sendResetPasswordLinkEmail = new SendResetPasswordLinkEmailUseCase(
      usersTestRepository,
      nodemailerMailProvider
    );
  });

  it("should be able to send an email with reset password link to user", async () => {
    const token = crypto.randomBytes(3).toString("hex");

    (<jest.Mock>usersTestRepository.findById).mockReturnValue(user);

    (<jest.Mock>nodemailerMailProvider.sendEmail).mockReturnValue({
      response: "250 Accepted",
    });

    const result = await sendResetPasswordLinkEmail.execute({
      token_id: token,
      user_id: user.id,
    });

    expect(result).toEqual(EMAIL_SUCCESSFULLY_SENT);
  });

  it("should not be able to send email with invalid user id", async () => {
    (<jest.Mock>usersTestRepository.findById).mockReturnValue(undefined);

    expect(async () => {
      const fake_id = v4();

      await sendResetPasswordLinkEmail.execute({
        token_id: "anyvalidtoken",
        user_id: fake_id,
      });
    }).rejects.toThrow(USER_NOT_FOUND_ERROR);
  });
});
