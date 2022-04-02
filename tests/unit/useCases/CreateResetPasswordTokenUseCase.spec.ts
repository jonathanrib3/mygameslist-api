import { TokensTestRepository } from "@modules/accounts/repositories/in-memory/TokensTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateResetPasswordTokenUseCase } from "@modules/accounts/useCases/create_reset_password_token/CreateResetPasswordTokenUseCase";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";

import { reset_token } from "../../dummies/default_reset_token_dummy";
import { user } from "../../dummies/default_user_dummy";

jest.mock("@modules/accounts/repositories/in-memory/TokensTestRepository");
jest.mock("@modules/accounts/repositories/in-memory/UsersTestRepository");

describe("password reset unit tests", () => {
  let tokensTestRepository: TokensTestRepository;
  let usersTestRepository: UsersTestRepository;
  let createResetPasswordTokenUseCase: CreateResetPasswordTokenUseCase;

  beforeEach(async () => {
    tokensTestRepository = new TokensTestRepository();
    usersTestRepository = new UsersTestRepository();
    createResetPasswordTokenUseCase = new CreateResetPasswordTokenUseCase(
      tokensTestRepository,
      usersTestRepository
    );
  });

  it("should be able to generate a new token if it doesn't exists", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.findByEmail).mockReturnValue(user);

    (<jest.Mock>tokensTestRepository.create).mockReturnValue(reset_token);

    // Act

    const result = await createResetPasswordTokenUseCase.execute(user.email);

    // Assert

    expect(result).toEqual(reset_token);
  });

  it("should not be able to generate a new token with invalid user email", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.findByEmail).mockReturnValue(undefined);

    await expect(async () => {
      // Act

      await createResetPasswordTokenUseCase.execute(
        "anyinvalidemail@email.com"
      );
      // Assert
    }).rejects.toThrow(USER_NOT_FOUND_ERROR);
  });
});
