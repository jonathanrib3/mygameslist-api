"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UsersTestRepository_1 = require("@modules/accounts/repositories/in-memory/UsersTestRepository");
const CreateSessionUseCase_1 = require("@modules/accounts/useCases/create_session/CreateSessionUseCase");
const CreateUserUseCase_1 = require("@modules/accounts/useCases/create_user/CreateUserUseCase");
const error_messages_1 = require("@shared/constants/error_messages");
const regexes_1 = require("@shared/constants/regexes");
const JwtProvider_1 = require("@shared/containers/providers/implementations/JwtProvider");
let usersTestRepository;
let jwtProvider;
let createSessionUseCase;
let createUserUseCase;
describe("create session unit tests", () => {
    beforeEach(() => {
        usersTestRepository = new UsersTestRepository_1.UsersTestRepository();
        jwtProvider = new JwtProvider_1.JwtProvider();
        createSessionUseCase = new CreateSessionUseCase_1.CreateSessionUseCase(usersTestRepository, jwtProvider);
        createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(usersTestRepository);
    });
    it("should be able to generate a new token with valid user infos", async () => {
        const user = await createUserUseCase.execute({
            email: "test@mygameslist.com",
            username: "macomaco",
            password: "testpsswd",
        });
        const token = await createSessionUseCase.execute({
            email: user.email,
            password: "testpsswd",
        });
        expect(token).toMatch(regexes_1.JWT_TOKEN_REGEX);
    });
    it("should not be able to generate a new token with invalid email", async () => {
        await expect(async () => {
            await createUserUseCase.execute({
                email: "test@mygameslist.com",
                username: "macomaco",
                password: "testpsswd",
            });
            await createSessionUseCase.execute({
                email: "test@mygameslist.com.br",
                password: "testpsswd",
            });
        }).rejects.toThrow(error_messages_1.INVALID_LOGIN_ERROR);
    });
    it("should not be able to generate a new token with invalid password", async () => {
        await expect(async () => {
            await createUserUseCase.execute({
                email: "test@mygameslist.com",
                username: "macomaco",
                password: "testpsswd",
            });
            await createSessionUseCase.execute({
                email: "test@mygameslist.com",
                password: "testpsswdd",
            });
        }).rejects.toThrow(error_messages_1.INVALID_LOGIN_ERROR);
    });
});
