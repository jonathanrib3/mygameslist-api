import { v4 } from "uuid";

import { AppError } from "@infra/errors/AppError";
import { ResetSessionsTestRepository } from "@modules/accounts/repositories/in-memory/ResetSessionsTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateResetSessionUseCase } from "@modules/accounts/useCases/create_reset_session/CreateResetSessionUseCase";
import {
  EXISTENT_NON_EXPIRED_SESSION_ERROR,
  INTERNAL_SERVER_ERROR,
  USER_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";

import { session } from "../../dummies/default_session_dummy";
import { user } from "../../dummies/default_user_dummy";

jest.mock("@modules/accounts/repositories/in-memory/UsersTestRepository");
jest.mock(
  "@modules/accounts/repositories/in-memory/ResetSessionsTestRepository"
);

describe("create reset session unit tests", () => {
  let sessionsTestRepository: ResetSessionsTestRepository;
  let usersTestRepository: UsersTestRepository;
  let createResetSessionUseCase: CreateResetSessionUseCase;

  beforeAll(async () => {
    usersTestRepository = new UsersTestRepository();
    sessionsTestRepository = new ResetSessionsTestRepository();
    createResetSessionUseCase = new CreateResetSessionUseCase(
      usersTestRepository,
      sessionsTestRepository
    );
  });

  it("should be able to create a new session with valid info", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.findById).mockReturnValue(user);
    (<jest.Mock>sessionsTestRepository.create).mockReturnValue(session);

    // Act

    const result = await createResetSessionUseCase.execute(user.id);

    // Assert

    expect(result).toEqual(session);
  });

  it("should be able to create a new session with valid info if there's an already existing expired session", async () => {
    // Arrange

    (<jest.Mock>sessionsTestRepository.isSessionExpired).mockReturnValue(true);

    (<jest.Mock>sessionsTestRepository.create).mockImplementation(() => {
      if (sessionsTestRepository.isSessionExpired(session)) {
        return session;
      }
      throw new AppError(500, INTERNAL_SERVER_ERROR);
    });

    // Act

    const result = await createResetSessionUseCase.execute(user.id);

    // Assert

    expect(result).toEqual(session);
  });

  it("should not be able to create a new session with invalid user id", async () => {
    // Arrange
    (<jest.Mock>usersTestRepository.findById).mockReturnValue(undefined);

    const fake_id = v4();

    expect(async () => {
      // Act

      await createResetSessionUseCase.execute(fake_id);
      // Assert
    }).rejects.toThrow(USER_NOT_FOUND_ERROR);
  });

  it("should not be able to create a new session with another non expired user session", async () => {
    // Arrange

    (<jest.Mock>usersTestRepository.findById).mockReturnValue(user);

    (<jest.Mock>sessionsTestRepository.create).mockImplementation(() => {
      throw new AppError(400, EXISTENT_NON_EXPIRED_SESSION_ERROR);
    });

    await expect(async () => {
      // Act

      await createResetSessionUseCase.execute(user.id);
      // Assert
    }).rejects.toThrow(EXISTENT_NON_EXPIRED_SESSION_ERROR);
  });
});
