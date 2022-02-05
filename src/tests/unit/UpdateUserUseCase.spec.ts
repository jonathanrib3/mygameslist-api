import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateUserUseCase } from "@modules/accounts/useCases/create_user/CreateUserUseCase";
import { UpdateUserUseCase } from "@modules/accounts/useCases/update_user/UpdateUserUseCase";
import {
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";

let usersTestRepository: UsersTestRepository;
let createUserUseCase: CreateUserUseCase;
let updateUserUseCase: UpdateUserUseCase;

describe("update user unit tests", () => {
  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    createUserUseCase = new CreateUserUseCase(usersTestRepository);
    updateUserUseCase = new UpdateUserUseCase(usersTestRepository);
  });

  it("should be able to update user's username", async () => {
    const user = await createUserUseCase.execute({
      email: "test@mygameslist.com",
      username: "test902",
      password: "sooos3",
    });

    const oldUsername = user.username;

    await updateUserUseCase.execute({
      id: user.id,
      username: "test209",
    });

    expect(user.username).not.toBe(oldUsername);
  });

  it("should be able to update user's password", async () => {
    const user = await createUserUseCase.execute({
      email: "test@mygameslist.com",
      username: "test902",
      password: "sooos3",
    });
    const oldPassword = user.password;

    await updateUserUseCase.execute({
      id: user.id,
      password: "soooos4",
    });

    expect(user.password.length).toBe(60);
    expect(user.password).not.toBe(oldPassword);
  });

  it("should be able to update both user's password and username", async () => {
    const user = await createUserUseCase.execute({
      email: "test@mygameslist.com",
      username: "test902",
      password: "sooos3",
    });

    const oldData = {
      username: user.username,
      password: user.password,
    };

    await updateUserUseCase.execute({
      id: user.id,
      username: "anyothervalidusername",
      password: "soooos4",
    });

    expect(user.username).not.toBe(oldData.username);
    expect(user.password).not.toBe(oldData.password);
  });

  it("should not be able to update user's username to another one that's already in use", async () => {
    await expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@mygameslist.com",
        username: "test902",
        password: "sooos3",
      });

      await createUserUseCase.execute({
        email: "test2@mygameslist.com",
        username: "test222",
        password: "sooos4",
      });

      await updateUserUseCase.execute({
        id: user.id,
        username: "test222",
      });
    }).rejects.toThrow(USERNAME_ALREADY_EXISTS_ERROR);
  });

  it("should not be able to update user's username to another one that's shorter than 4 characters", async () => {
    await expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@mygameslist.com",
        username: "test321",
        password: "sooos3",
      });

      await updateUserUseCase.execute({
        id: user.id,
        username: "tes",
      });
    }).rejects.toThrow(USERNAME_LENGTH_ERROR);
  });
});
