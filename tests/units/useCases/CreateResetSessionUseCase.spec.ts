import { v4 } from "uuid";

import { User } from "@modules/accounts/models/User";
import { ResetSessionsTestRepository } from "@modules/accounts/repositories/in-memory/ResetSessionsTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateResetSessionUseCase } from "@modules/accounts/useCases/create_reset_session/CreateResetSessionUseCase";
import { CreateUserUseCase } from "@modules/accounts/useCases/create_user/CreateUserUseCase";
import {
  EXISTENT_NON_EXPIRED_SESSION_ERROR,
  USER_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { UUID_V4_REGEX } from "@shared/constants/regexes";
import { SESSION_CREATED_SUCCESSFULLY } from "@shared/constants/successful_messages";

let sessionsTestRepository: ResetSessionsTestRepository;
let usersTestRepository: UsersTestRepository;
let createUserUseCase: CreateUserUseCase;
let createResetSessionUseCase: CreateResetSessionUseCase;
let user: User;

describe("create reset session unit tests", () => {
  beforeAll(async () => {
    usersTestRepository = new UsersTestRepository();
    sessionsTestRepository = new ResetSessionsTestRepository();
    createUserUseCase = new CreateUserUseCase(usersTestRepository);
    createResetSessionUseCase = new CreateResetSessionUseCase(
      usersTestRepository,
      sessionsTestRepository
    );

    user = await createUserUseCase.execute({
      email: "test@mygameslist.com",
      username: "testuser",
      password: "testpasswd",
    });
  });

  it("should be able to create a new session with valid info", async () => {
    const result = await createResetSessionUseCase.execute(user.id);
    const session_created = await sessionsTestRepository.findByUserId(user.id);

    expect(result).toBe(SESSION_CREATED_SUCCESSFULLY);
    expect(session_created.id).toMatch(UUID_V4_REGEX);
    expect(session_created.user_id).toMatch(UUID_V4_REGEX);
  });

  it("should be able to create a new session with valid info if there's an already existing expired session", async () => {
    const old_session = await sessionsTestRepository.findByUserId(user.id);

    await sessionsTestRepository.setSessionToExpired(old_session.id);

    const new_session_result = await createResetSessionUseCase.execute(user.id);

    const new_session = await sessionsTestRepository.findByUserId(user.id);

    console.log(old_session, new_session);

    expect(new_session_result).toBe(SESSION_CREATED_SUCCESSFULLY);
    expect(new_session).not.toEqual(old_session);
  });

  it("should not be able to create a new session with invalid user id", async () => {
    const fake_id = v4();

    expect(async () => {
      await createResetSessionUseCase.execute(fake_id);
    }).rejects.toThrow(USER_NOT_FOUND_ERROR);
  });

  it("should not be able to create a new session with another non expired user session", async () => {
    await expect(async () => {
      await createResetSessionUseCase.execute(user.id);
    }).rejects.toThrow(EXISTENT_NON_EXPIRED_SESSION_ERROR);
  });
});
