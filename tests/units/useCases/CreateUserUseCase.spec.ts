import { AppError } from "@infra/errors/AppError";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateUserUseCase } from "@modules/accounts/useCases/create_user/CreateUserUseCase";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";
import { VALID_USER_DATA_MESSAGE } from "@shared/constants/successful_messages";

import { user } from "../../dummies/default_user_dummy";

jest.mock("@modules/accounts/repositories/in-memory/UsersTestRepository");

describe("create user unit tests", () => {
  let usersTestRepository: UsersTestRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    createUserUseCase = new CreateUserUseCase(usersTestRepository);
  });

  it("should be able to create a new user", async () => {
    (<jest.Mock>(
      usersTestRepository.validateUserToBeCreatedData
    )).mockReturnValue(VALID_USER_DATA_MESSAGE);

    (<jest.Mock>usersTestRepository.create).mockReturnValue(user);

    const result = await createUserUseCase.execute({
      email: user.email,
      password: user.password,
      username: user.username,
      avatar: user.avatar,
    });

    expect(result).toEqual(user);
  });

  it("should not be able to create a user with same email", async () => {
    (<jest.Mock>usersTestRepository.create).mockImplementation(() => {
      throw new AppError(400, EMAIL_ALREADY_EXISTS_ERROR);
    });

    await expect(async () => {
      await createUserUseCase.execute({
        email: "anyexistentemail@mygameslist.com.br",
        password: "test123",
        username: "test-user",
        avatar: "test-avatar",
      });
    }).rejects.toThrow(EMAIL_ALREADY_EXISTS_ERROR);
  });

  it("should not be able to create a user with same username", async () => {
    (<jest.Mock>usersTestRepository.create).mockImplementation(() => {
      throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);
    });

    await expect(async () => {
      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "anyexistentusername",
        avatar: "test-avatar",
      });
    }).rejects.toThrow(USERNAME_ALREADY_EXISTS_ERROR);
  });

  it("should not be able to create a user with username shorter than 4 characters", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "tes",
        avatar: "test-avatar",
      });
    }).rejects.toThrow(USERNAME_LENGTH_ERROR);
  });

  it("should not be able to create a user with username longer than 35 characters", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "areallyreallyreallyreallylongusername",
      });
    }).rejects.toThrow(USERNAME_LENGTH_ERROR);
  });
});
