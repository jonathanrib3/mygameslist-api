import { AppError } from "@infra/errors/AppError";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { CreateUserUseCase } from "@modules/accounts/useCases/create_user/CreateUserUseCase";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";
import { VALID_USER_DATA_MESSAGE } from "@shared/constants/successful_messages";

import { user } from "../../dummies/default_user_dummy";

jest.mock(
  "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository"
);

describe("create user unit tests", () => {
  let usersTestRepository: UsersTestRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    createUserUseCase = new CreateUserUseCase(usersTestRepository);
  });

  it("should be able to create a new user", async () => {
    // Arrange

    (<jest.Mock>(
      usersTestRepository.validateUserToBeCreatedData
    )).mockReturnValue(VALID_USER_DATA_MESSAGE);

    (<jest.Mock>usersTestRepository.create).mockReturnValue(user);

    // Act

    const result = await createUserUseCase.execute({
      email: user.email,
      password: user.password,
      username: user.username,
      avatar: user.avatar,
    });

    // Assert

    expect(result).toEqual(user);
  });

  it("should not be able to create a user with same email", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.create).mockImplementation(() => {
      throw new AppError(400, EMAIL_ALREADY_EXISTS_ERROR);
    });

    await expect(async () => {
      // Act

      await createUserUseCase.execute({
        email: "anyexistentemail@mygameslist.com.br",
        password: "test123",
        username: "test-user",
        avatar: "test-avatar",
      });
      // Assert
    }).rejects.toThrow(EMAIL_ALREADY_EXISTS_ERROR);
  });

  it("should not be able to create a user with same username", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.create).mockImplementation(() => {
      throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);
    });

    await expect(async () => {
      // Act

      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "anyexistentusername",
        avatar: "test-avatar",
      });
      // Assert
    }).rejects.toThrow(USERNAME_ALREADY_EXISTS_ERROR);
  });

  it("should not be able to create a user with username shorter than 4 characters", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.create).mockImplementation(() => {
      throw new AppError(400, USERNAME_LENGTH_ERROR);
    });

    await expect(async () => {
      // Act

      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "tes",
        avatar: "test-avatar",
      });
      // Assert
    }).rejects.toThrow(USERNAME_LENGTH_ERROR);
  });

  it("should not be able to create a user with username longer than 35 characters", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.create).mockImplementation(() => {
      throw new AppError(400, USERNAME_LENGTH_ERROR);
    });

    await expect(async () => {
      // Act

      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "areallyreallyreallyreallylongusername",
      });
      // Assert
    }).rejects.toThrow(USERNAME_LENGTH_ERROR);
  });
});
