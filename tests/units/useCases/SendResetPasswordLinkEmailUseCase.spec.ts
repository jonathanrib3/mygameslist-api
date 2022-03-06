import crypto from "crypto";
import { v4 } from "uuid";

import { User } from "@modules/accounts/models/User";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { NodeMailerMailProvider } from "@shared/containers/providers/implementations/NodeMailerMailProvider";

import { SendResetPasswordLinkEmailUseCase } from "./__mocks__/SendResetPasswordLinkEmailUseCase";

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
    const user = new User();
    const token = crypto.randomBytes(3).toString("hex");

    Object.assign(user, {
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user",
      avatar: "test-avatar",
      created_at: new Date(),
      updated_at: new Date(),
    });

    (<jest.Mock>usersTestRepository.findById).mockReturnValue({
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
      avatar: user.avatar,
      gamesList: {
        id: user.gamesList.id,
        list: [],
      },
      admin: user.admin,
      created_at: user.created_at,
      updated_at: new Date(),
    });

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
