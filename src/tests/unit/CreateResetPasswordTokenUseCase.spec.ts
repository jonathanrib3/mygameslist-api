import { User } from "@modules/accounts/models/User";
import { TokensTestRepository } from "@modules/accounts/repositories/in-memory/TokensTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateResetPasswordTokenUseCase } from "@modules/accounts/useCases/create_reset_password_token/CreateResetPasswordTokenUseCase";
import { CreateUserUseCase } from "@modules/accounts/useCases/create_user/CreateUserUseCase";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";
import { UUID_V4_REGEX } from "@shared/constants/regexes";

let tokensTestRepository: TokensTestRepository;
let usersTestRepository: UsersTestRepository;
let createUserUseCase: CreateUserUseCase;
let createResetPasswordTokenUseCase: CreateResetPasswordTokenUseCase;
let user: User;

describe("password reset unit tests", () => {
  beforeAll(async () => {
    tokensTestRepository = new TokensTestRepository();
    usersTestRepository = new UsersTestRepository();
    createUserUseCase = new CreateUserUseCase(usersTestRepository);
    createResetPasswordTokenUseCase = new CreateResetPasswordTokenUseCase(
      tokensTestRepository,
      usersTestRepository
    );

    user = await createUserUseCase.execute({
      email: "test@mygameslist.com",
      username: "testuser",
      password: "testpasswd",
    });
  });

  it("should be able to generate a new token if it doesn't exists", async () => {
    const data = await createResetPasswordTokenUseCase.execute(user.email);

    expect(data.token.length).toBe(64);
    expect(data.user_id).toMatch(UUID_V4_REGEX);
  });

  it("should not be able to generate a new token with invalid user email", async () => {
    await expect(async () => {
      await createResetPasswordTokenUseCase.execute(
        "anyinvalidemail@email.com"
      );
    }).rejects.toThrow(USER_NOT_FOUND_ERROR);
  });
});
