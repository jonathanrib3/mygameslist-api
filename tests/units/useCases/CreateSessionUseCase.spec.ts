import bcrypt from "bcrypt";

import { AppError } from "@infra/errors/AppError";
import { User } from "@modules/accounts/models/User";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateAuthSessionUseCase } from "@modules/accounts/useCases/create_auth_session/CreateAuthSessionUseCase";
import { INVALID_LOGIN_ERROR } from "@shared/constants/error_messages";
import { JwtProvider } from "@shared/containers/providers/implementations/JwtProvider";

jest.mock("@modules/accounts/repositories/in-memory/UsersTestRepository");
jest.mock("@shared/containers/providers/implementations/JwtProvider");
jest.mock("bcrypt");

describe("create session unit test", () => {
  let usersTestRepository: UsersTestRepository;
  let jwtProvider: JwtProvider;
  let createSessionUseCase: CreateAuthSessionUseCase;

  beforeEach(async () => {
    usersTestRepository = new UsersTestRepository();
    jwtProvider = new JwtProvider();
    createSessionUseCase = new CreateAuthSessionUseCase(
      usersTestRepository,
      jwtProvider
    );
  });

  it("should be able to generate a new token with valid user infos", async () => {
    const user = new User();

    Object.assign(user, {
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user",
      avatar: "test-avatar",
      created_at: new Date(),
      updated_at: new Date(),
    });

    (<jest.Mock>usersTestRepository.findByEmail).mockReturnValue({
      id: user.id,
      email: user.email,
      password: user.password,
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

    (<jest.Mock>bcrypt.compare).mockReturnValue(true);

    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNjk2NWU2NjYtOGQyZS00NGY2LWI0ZDUtNjczZTUxOGQ2NzdkIn0.jKeUb-BZPYO6fBSYtNWT52G3zSBOc5sAHvJ_yE8KqVg";

    (<jest.Mock>jwtProvider.sign).mockReturnValue(token);

    const result = await createSessionUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toEqual(token);
  });

  it("should not be able to generate a new token with invalid email", async () => {
    (<jest.Mock>usersTestRepository.findByEmail).mockImplementation(() => {
      throw new AppError(400, INVALID_LOGIN_ERROR);
    });

    await expect(async () => {
      await createSessionUseCase.execute({
        email: "anynonexistentemail@email.com",
        password: "testpsswd",
      });
    }).rejects.toThrow(INVALID_LOGIN_ERROR);
  });

  it("should not be able to generate a new token with invalid password", async () => {
    (<jest.Mock>bcrypt.compare).mockReturnValue(false);

    await expect(async () => {
      await createSessionUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "anywrongpasswd",
      });
    }).rejects.toThrow(INVALID_LOGIN_ERROR);
  });
});
