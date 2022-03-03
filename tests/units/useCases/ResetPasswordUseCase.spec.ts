import { User } from "@modules/accounts/models/User";
import { TokensTestRepository } from "@modules/accounts/repositories/in-memory/TokensTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateResetPasswordTokenUseCase } from "@modules/accounts/useCases/create_reset_password_token/CreateResetPasswordTokenUseCase";
import { CreateUserUseCase } from "@modules/accounts/useCases/create_user/CreateUserUseCase";
import { ResetPasswordUseCase } from "@modules/accounts/useCases/reset_password/ResetPasswordUseCase";
import { EXPIRED_TOKEN_ERROR } from "@shared/constants/error_messages";

let usersTestRepository: UsersTestRepository;
let tokensTestRepository: TokensTestRepository;
let createUserUseCase: CreateUserUseCase;
let createResetPasswordTokenUseCase: CreateResetPasswordTokenUseCase;
let resetPasswordUseCase: ResetPasswordUseCase;
let user: User;

describe("reset password unit tests", () => {
  beforeAll(async () => {
    usersTestRepository = new UsersTestRepository();
    tokensTestRepository = new TokensTestRepository();
    createUserUseCase = new CreateUserUseCase(usersTestRepository);
    createResetPasswordTokenUseCase = new CreateResetPasswordTokenUseCase(
      tokensTestRepository,
      usersTestRepository
    );
    resetPasswordUseCase = new ResetPasswordUseCase(
      tokensTestRepository,
      usersTestRepository
    );

    user = await createUserUseCase.execute({
      email: "test@mygameslist.com",
      username: "testuser",
      password: "testpasswd",
    });
  });

  it("should be able to reset a password with a valid token", async () => {
    const created_token = await createResetPasswordTokenUseCase.execute(
      user.email
    );

    const old_password = user.password;

    const update = await resetPasswordUseCase.execute(
      created_token.token_id,
      "newpasswd321"
    );

    expect(update.password).not.toBe(old_password);
  });

  it("should not be able to reset a password with an already expired token", async () => {
    const created_token = await createResetPasswordTokenUseCase.execute(
      user.email
    );

    const { token_id } = created_token;

    await tokensTestRepository.setTokenToExpired(token_id);

    expect(async () => {
      await resetPasswordUseCase.execute(token_id, "newpasswd123");
    }).rejects.toThrow(EXPIRED_TOKEN_ERROR);
  });
});
