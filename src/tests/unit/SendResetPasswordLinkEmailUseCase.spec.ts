import { v4 } from "uuid";

import { User } from "@modules/accounts/models/User";
import { TokensTestRepository } from "@modules/accounts/repositories/in-memory/TokensTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateResetPasswordTokenUseCase } from "@modules/accounts/useCases/create_reset_password_token/CreateResetPasswordTokenUseCase";
import { CreateUserUseCase } from "@modules/accounts/useCases/create_user/CreateUserUseCase";
import { SendResetPasswordLinkEmailUseCase } from "@modules/accounts/useCases/send_reset_password_link_email/SendResetPasswordLinkEmailUseCase";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { NodeMailerMailProvider } from "@shared/containers/providers/implementations/NodeMailerMailProvider";

let usersTestRepository: UsersTestRepository;
let tokensTestRepository: TokensTestRepository;
let createUserUseCase: CreateUserUseCase;
let createResetPasswordTokenUseCase: CreateResetPasswordTokenUseCase;
let sendResetPasswordLinkEmail: SendResetPasswordLinkEmailUseCase;
let nodemailerMailProvider: NodeMailerMailProvider;
let user: User;
let token_data: {
  token_id: string;
  user_id: string;
};

describe("send reset password email unit tests", () => {
  beforeAll(async () => {
    usersTestRepository = new UsersTestRepository();
    tokensTestRepository = new TokensTestRepository();
    createUserUseCase = new CreateUserUseCase(usersTestRepository);

    user = await createUserUseCase.execute({
      email: "test@mygameslist.com",
      username: "testuser",
      password: "testpasswd",
    });

    createResetPasswordTokenUseCase = new CreateResetPasswordTokenUseCase(
      tokensTestRepository,
      usersTestRepository
    );

    token_data = await createResetPasswordTokenUseCase.execute(user.email);

    nodemailerMailProvider = new NodeMailerMailProvider();

    sendResetPasswordLinkEmail = new SendResetPasswordLinkEmailUseCase(
      usersTestRepository,
      nodemailerMailProvider
    );
  });

  it("should be able to send an email with reset password link to user", async () => {
    const { token_id, user_id } = token_data;
    const message = await sendResetPasswordLinkEmail.execute({
      token_id,
      user_id,
    });

    expect(message).toBe(EMAIL_SUCCESSFULLY_SENT);
  });

  it("should not be able to send email with invalid user id", async () => {
    expect(async () => {
      const { token_id } = token_data;
      const fake_id = v4();

      await sendResetPasswordLinkEmail.execute({ token_id, user_id: fake_id });
    }).rejects.toThrow(USER_NOT_FOUND_ERROR);
  });
});
