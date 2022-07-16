import bcrypt from "bcrypt";

import { AppError } from "@infra/errors/AppError";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { CreateAuthSessionUseCase } from "@modules/accounts/useCases/create_auth_session/CreateAuthSessionUseCase";
import { INVALID_LOGIN_ERROR } from "@shared/constants/error_messages";
import { JwtProvider } from "@shared/containers/providers/implementations/JwtProvider";

import { user } from "../../dummies/default_user_dummy";

jest.mock(
  "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository"
);
jest.mock("@shared/containers/providers/implementations/JwtProvider");
jest.mock("bcrypt");

describe("create session unit test", () => {
  let usersTestRepository: UsersTestRepository;
  let jwtProvider: JwtProvider;
  let createSessionUseCase: CreateAuthSessionUseCase;

  beforeEach(async () => {
    usersTestRepository = new UsersTestRepository();
    jwtProvider = new JwtProvider();
    createSessionUseCase = new CreateAuthSessionUseCase(
      usersTestRepository,
      jwtProvider
    );
  });

  it("should be able to generate a new token with valid user infos", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.findByEmail).mockReturnValue(user);

    (<jest.Mock>bcrypt.compare).mockReturnValue(true);

    const token = "some valid token";

    (<jest.Mock>jwtProvider.sign).mockReturnValue(token);

    // Act

    const result = await createSessionUseCase.execute({
      email: user.email,
      password: user.password,
    });

    // Assert

    expect(result).toEqual(token);
  });

  it("should not be able to generate a new token with invalid email", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.findByEmail).mockImplementation(() => {
      throw new AppError(400, INVALID_LOGIN_ERROR);
    });

    await expect(async () => {
      // Act

      await createSessionUseCase.execute({
        email: "anynonexistentemail@email.com",
        password: "testpsswd",
      });
      // Assert
    }).rejects.toThrow(INVALID_LOGIN_ERROR);
  });

  it("should not be able to generate a new token with invalid password", async () => {
    // Arrange
    (<jest.Mock>bcrypt.compare).mockReturnValue(false);

    await expect(async () => {
      // Act

      await createSessionUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "anywrongpasswd",
      });
      // Assert
    }).rejects.toThrow(INVALID_LOGIN_ERROR);
  });
});
