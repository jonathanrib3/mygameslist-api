import bcrypt from "bcrypt";
import { v4 } from "uuid";

import { AppError } from "@infra/errors/AppError";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { UpdateUserUseCase } from "@modules/accounts/useCases/update_user/UpdateUserUseCase";
import {
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";

import { user } from "../../dummies/default_user_dummy";

jest.mock(
  "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository"
);
jest.mock("bcrypt");

describe("Update User Use Case", () => {
  let usersTestRepository: UsersTestRepository;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(async () => {
    usersTestRepository = new UsersTestRepository();
    updateUserUseCase = new UpdateUserUseCase(usersTestRepository);
  });

  it("should be able to update user's username", async () => {
    // Arrange

    const newusername = "newusername!132";

    (<jest.Mock>usersTestRepository.update).mockReturnValue({
      id: user.id,
      email: user.email,
      username: newusername,
      password: user.password,
      avatar: user.avatar,
      gamesList: {
        id: user.gamesList.id,
        list: [],
      },
      admin: user.admin,
      created_at: user.created_at,
      updated_at: new Date(),
    });

    // Act

    const updated_user = await updateUserUseCase.execute({
      id: user.id,
      username: newusername,
    });

    // Assert

    expect(user).not.toEqual(updated_user);
  });

  it("should be able to update user's password", async () => {
    // Arrange

    const newpassword = "newpsswd!321";

    (<jest.Mock>bcrypt.hashSync).mockReturnValue(newpassword);

    (<jest.Mock>usersTestRepository.update).mockReturnValue({
      id: user.id,
      email: user.email,
      password: newpassword,
      username: user.username,
      avatar: user.avatar,
      gamesList: {
        id: user.gamesList.id,
        list: [],
      },
      admin: user.admin,
      created_at: user.created_at,
      updated_at: new Date(),
    });

    // Act

    const updated_user = await updateUserUseCase.execute({
      id: user.id,
      password: newpassword,
    });

    // Assert

    expect(user).not.toEqual(updated_user);
  });

  it("should be able to update both user's password and username", async () => {
    // Arrange

    const newusername = "newusername!132";
    const newpassword = "newpsswd!321";

    (<jest.Mock>bcrypt.hashSync).mockReturnValue(newpassword);

    (<jest.Mock>usersTestRepository.update).mockReturnValue({
      id: user.id,
      email: user.email,
      password: newpassword,
      username: newusername,
      avatar: user.avatar,
      gamesList: {
        id: user.gamesList.id,
        list: [],
      },
      admin: user.admin,
      created_at: user.created_at,
      updated_at: new Date(),
    });

    // Act

    const updated_user = await updateUserUseCase.execute({
      id: user.id,
      password: newpassword,
      username: newusername,
    });

    // Assert

    expect(user).not.toEqual(updated_user);
  });

  it("should not be able to update user's username to another one that's already in use", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.update).mockImplementation(() => {
      throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);
    });

    await expect(async () => {
      // Act

      await updateUserUseCase.execute({
        id: v4(),
        username: "anyusernameinuse",
      });
      // Assert
    }).rejects.toThrow(USERNAME_ALREADY_EXISTS_ERROR);
  });

  it("should not be able to update user's username to another one that's shorter than 4 characters", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.update).mockImplementation(() => {
      throw new AppError(400, USERNAME_LENGTH_ERROR);
    });

    await expect(async () => {
      // Act

      await updateUserUseCase.execute({
        id: v4(),
        username: "any",
      });
      // Assert
    }).rejects.toThrow(USERNAME_LENGTH_ERROR);
  });
});
