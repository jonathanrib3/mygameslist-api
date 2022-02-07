"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UsersTestRepository_1 = require("@modules/accounts/repositories/in-memory/UsersTestRepository");
const regexes_1 = require("@shared/constants/regexes");
const error_messages_1 = require("@shared/constants/error_messages");
const CreateUserUseCase_1 = require("../../modules/accounts/useCases/create_user/CreateUserUseCase");
let usersTestRepository;
let createUserUseCase;
describe("create user unit tests", () => {
    beforeEach(() => {
        usersTestRepository = new UsersTestRepository_1.UsersTestRepository();
        createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(usersTestRepository);
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
        expect(newUser.id).toMatch(regexes_1.UUID_V4_REGEX);
        expect(newUser).toHaveProperty("created_at");
    });
    it("should not be able to create a user with same email", async () => {
        await expect(async () => {
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
        }).rejects.toThrow(error_messages_1.EMAIL_ALREADY_EXISTS_ERROR);
    });
    it("should not be able to create a user with same username", async () => {
        await expect(async () => {
            await createUserUseCase.execute({
                email: "test@mygameslist.com.br",
                password: "test123",
                username: "test-user666",
            });
            await createUserUseCase.execute({
                email: "different_test@mygameslist.com.br",
                password: "test321",
                username: "test-user666",
            });
        }).rejects.toThrow(error_messages_1.USERNAME_ALREADY_EXISTS_ERROR);
    });
    it("should not be able to create a user with username shorter than 4 characters", async () => {
        await expect(async () => {
            await createUserUseCase.execute({
                email: "test@mygameslist.com.br",
                password: "test123",
                username: "tes",
            });
        }).rejects.toThrow(error_messages_1.USERNAME_LENGTH_ERROR);
    });
    it("should not be able to create a user with username longer than 35 characters", async () => {
        await expect(async () => {
            await createUserUseCase.execute({
                email: "test@mygameslist.com.br",
                password: "test123",
                username: "areallyreallyreallyreallylongusername",
            });
        }).rejects.toThrow(error_messages_1.USERNAME_LENGTH_ERROR);
    });
});
