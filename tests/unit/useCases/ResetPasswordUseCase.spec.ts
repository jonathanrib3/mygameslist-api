import bcrypt from "bcrypt";

import { User } from "@modules/accounts/models/User";
import { ResetPasswordSessionsTestRepository } from "@modules/accounts/repositories/implementations/in-memory/ResetPasswordSessionsTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { ResetPasswordUseCase } from "@modules/accounts/useCases/reset_password/ResetPasswordUseCase";
import { session } from "@root/tests/dummies/default_session_dummy";
import { user } from "@root/tests/dummies/default_user_dummy";
import {
  INVALID_RESET_TOKEN_ERROR,
  RESET_SESSION_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";

describe("reset password unit tests", () => {
  let usersTestRepository: UsersTestRepository;
  let ResetPasswordSessionsTestRepository: ResetPasswordSessionsTestRepository;
  let resetPasswordUseCase: ResetPasswordUseCase;
  const new_password = "newpasswd321";

  beforeAll(async () => {
    usersTestRepository = new UsersTestRepository();
    ResetPasswordSessionsTestRepository = new ResetPasswordSessionsTestRepository();
    resetPasswordUseCase = new ResetPasswordUseCase(
      ResetPasswordSessionsTestRepository,
      usersTestRepository
    );
  });

  it("should be able to reset a password with a valid token", async () => {
    // Arrange

    const { id, token } = session;
    const user_to_be_updated = new User();

    Object.assign(user_to_be_updated, user);

    jest
      .spyOn(ResetPasswordSessionsTestRepository, "findById")
      .mockReturnValue(Promise.resolve(session));

    jest.spyOn(bcrypt, "compareSync").mockReturnValue(true);

    jest.spyOn(usersTestRepository, "update").mockImplementation(async () => {
      Object.assign(user_to_be_updated, {
        password: new_password,
      });

      return user_to_be_updated;
    });

    // Act

    const old_password = user.password;

    // Assert

    const update = await resetPasswordUseCase.execute({
      session_id: id,
      token_secret: token.token_secret,
      new_password,
    });

    expect(update.password).not.toBe(old_password);
  });

  it("should not be able to reset a password with an already expired token", async () => {
    // Arrange

    const { id, token } = session;

    jest
      .spyOn(ResetPasswordSessionsTestRepository, "findById")
      .mockReturnValue(Promise.resolve(undefined));

    // Act and Assert

    expect(async () => {
      await resetPasswordUseCase.execute({
        session_id: id,
        token_secret: token.token_secret,
        new_password,
      });
    }).rejects.toThrow(RESET_SESSION_NOT_FOUND_ERROR);
  });

  it("should not be able to reset a password with an invalid token secret", async () => {
    const { id } = session;

    jest
      .spyOn(ResetPasswordSessionsTestRepository, "findById")
      .mockReturnValue(Promise.resolve(session));

    jest.spyOn(bcrypt, "compareSync").mockReturnValue(false);

    expect(async () => {
      await resetPasswordUseCase.execute({
        session_id: id,
        token_secret: "wrongsecret",
        new_password,
      });
    }).rejects.toThrow(INVALID_RESET_TOKEN_ERROR);
  });
});
