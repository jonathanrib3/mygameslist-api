import { User } from "@modules/accounts/models/User";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { CreateSessionUseCase } from "@modules/accounts/useCases/create_session/CreateSessionUseCase";
import { CreateUserUseCase } from "@modules/accounts/useCases/create_user/CreateUserUseCase";
import { INVALID_LOGIN_ERROR } from "@shared/constants/error_messages";
import { JWT_TOKEN_REGEX } from "@shared/constants/regexes";
import { JwtProvider } from "@shared/containers/providers/implementations/JwtProvider";

let usersTestRepository: UsersTestRepository;
let jwtProvider: JwtProvider;
let createSessionUseCase: CreateSessionUseCase;
let createUserUseCase: CreateUserUseCase;

let user: User;

describe("create session unit test", () => {
  beforeEach(async () => {
    usersTestRepository = new UsersTestRepository();
    jwtProvider = new JwtProvider();
    createSessionUseCase = new CreateSessionUseCase(
      usersTestRepository,
      jwtProvider
    );
    createUserUseCase = new CreateUserUseCase(usersTestRepository);

    user = await createUserUseCase.execute({
      email: "test@mygameslist.com",
      username: "macomaco",
      password: "testpsswd",
    });
  });

  it("should be able to generate a new token with valid user infos", async () => {
    const token = await createSessionUseCase.execute({
      email: user.email,
      password: "testpsswd",
    });

    expect(token).toMatch(JWT_TOKEN_REGEX);
  });

  it("should not be able to generate a new token with invalid email", async () => {
    await expect(async () => {
      await createSessionUseCase.execute({
        email: "test@mygameslist.com.br",
        password: "testpsswd",
      });
    }).rejects.toThrow(INVALID_LOGIN_ERROR);
  });

  it("should not be able to generate a new token with invalid password", async () => {
    await expect(async () => {
      await createSessionUseCase.execute({
        email: "test@mygameslist.com",
        password: "testpsswdd",
      });
    }).rejects.toThrow(INVALID_LOGIN_ERROR);
  });
});
