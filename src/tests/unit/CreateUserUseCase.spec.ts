import { AppError } from "@errors/AppError";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";

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
    expect(newUser).toHaveProperty("id");
    expect(newUser).toHaveProperty("created_at");
  });

  it("should not be able to create a user with same email", () => {
    expect(async () => {
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
    }).rejects.toBeInstanceOf(AppError);
  });
});
