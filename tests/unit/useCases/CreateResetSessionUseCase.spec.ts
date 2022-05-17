import bcrypt from "bcrypt";
import { v4 } from "uuid";

import { AppError } from "@infra/errors/AppError";
import { ResetPasswordSessionsTestRepository } from "@modules/accounts/repositories/implementations/in-memory/ResetPasswordSessionsTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { CreateResetPasswordSessionUseCase } from "@modules/accounts/useCases/create_reset_session/CreateResetPasswordSessionUseCase";
import { SendResetPasswordLinkEmailUseCase } from "@modules/accounts/useCases/send_reset_password_link_email/SendResetPasswordLinkEmailUseCase";
import {
  EXISTENT_NON_EXPIRED_SESSION_ERROR,
  INTERNAL_SERVER_ERROR,
  USER_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { EMAIL_SUCCESSFULLY_SENT } from "@shared/constants/successful_messages";
import { NodeMailerMailProvider } from "@shared/containers/providers/implementations/NodeMailerMailProvider";

import { session } from "../../dummies/default_session_dummy";
import { user } from "../../dummies/default_user_dummy";

jest.mock(
  "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository"
);
jest.mock(
  "@modules/accounts/repositories/implementations/in-memory/ResetPasswordSessionsTestRepository"
);

describe("create reset session unit tests", () => {
  let sessionsTestRepository: ResetPasswordSessionsTestRepository;
  let usersTestRepository: UsersTestRepository;
  let createResetPasswordSessionUseCase: CreateResetPasswordSessionUseCase;
  let nodeMailerMailProvider: NodeMailerMailProvider;

  beforeAll(async () => {
    usersTestRepository = new UsersTestRepository();
    sessionsTestRepository = new ResetPasswordSessionsTestRepository();
    createResetPasswordSessionUseCase = new CreateResetPasswordSessionUseCase(
      usersTestRepository,
      sessionsTestRepository,
      nodeMailerMailProvider
    );
  });

  it("should be able to create a new session with valid info", async () => {
    // Arrange

    const { token_secret } = session.token;

    (<jest.Mock>usersTestRepository.findById).mockReturnValue(user);
    (<jest.Mock>sessionsTestRepository.create).mockReturnValue(session);
    jest
      .spyOn(SendResetPasswordLinkEmailUseCase.prototype, "execute")
      .mockReturnValue(Promise.resolve(EMAIL_SUCCESSFULLY_SENT));
    jest.spyOn(bcrypt, "hashSync").mockReturnValue(token_secret);
    // Act

    const result = await createResetPasswordSessionUseCase.execute(user.id);

    // Assert

    expect(result).toEqual(session);
  });

  it("should be able to create a new session with valid info if there's an already existing expired session", async () => {
    // Arrange

    const { token_secret } = session.token;

    (<jest.Mock>sessionsTestRepository.isSessionExpired).mockReturnValue(true);

    (<jest.Mock>sessionsTestRepository.create).mockImplementation(() => {
      if (sessionsTestRepository.isSessionExpired(session)) {
        return session;
      }
      throw new AppError(500, INTERNAL_SERVER_ERROR);
    });
    jest
      .spyOn(SendResetPasswordLinkEmailUseCase.prototype, "execute")
      .mockReturnValue(Promise.resolve(EMAIL_SUCCESSFULLY_SENT));

    jest.spyOn(bcrypt, "hashSync").mockReturnValue(token_secret);
    // Act

    const result = await createResetPasswordSessionUseCase.execute(user.id);

    // Assert

    expect(result).toEqual(session);
  });

  it("should not be able to create a new session with invalid user id", async () => {
    // Arrange
    (<jest.Mock>usersTestRepository.findById).mockReturnValue(undefined);

    const fake_id = v4();

    expect(async () => {
      // Act

      await createResetPasswordSessionUseCase.execute(fake_id);
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

      await createResetPasswordSessionUseCase.execute(user.id);
      // Assert
    }).rejects.toThrow(EXISTENT_NON_EXPIRED_SESSION_ERROR);
  });
});
