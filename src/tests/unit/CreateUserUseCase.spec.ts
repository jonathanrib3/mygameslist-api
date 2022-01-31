import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { UUID_V4_REGEX } from "@shared/constants/regexes";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
} from "@shared/constants/string_constants";

import { CreateUserUseCase } from "../../modules/accounts/useCases/create_user/CreateUserUseCase";

let usersTestRepository: UsersTestRepository;
let createUserUseCase: CreateUserUseCase;

describe("create user", () => {
  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    createUserUseCase = new CreateUserUseCase(usersTestRepository);
  });

  it("should be able to create a new user", async () => {
    const newUser = await createUserUseCase.execute({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user666",
    });

    expect(newUser.email).toBeDefined();
    expect(newUser.username).toBeDefined();
    expect(newUser.password).toBeDefined();
    expect(newUser.id).toMatch(UUID_V4_REGEX);
    expect(newUser).toHaveProperty("created_at");
  });

  it("should not be able to create a user with same email", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "test-user666",
      });
      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test321",
        username: "test-user999",
      });
    }).rejects.toThrow(EMAIL_ALREADY_EXISTS_ERROR);
  });

  it("should not be able to create a user with same username", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "test-user666",
      });

      await createUserUseCase.execute({
        email: "different_test@mygameslist.com.br",
        password: "test321",
        username: "test-user666",
      });
    }).rejects.toThrow(USERNAME_ALREADY_EXISTS_ERROR);
  });
});
