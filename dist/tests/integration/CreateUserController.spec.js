"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const tsyringe_1 = require("tsyringe");
const UsersTestRepository_1 = require("@modules/accounts/repositories/in-memory/UsersTestRepository");
const error_messages_1 = require("@shared/constants/error_messages");
const regexes_1 = require("@shared/constants/regexes");
const test_server_1 = require("./infra/http/test_server");
describe("create user integration tests", () => {
    beforeEach(() => {
        tsyringe_1.container.registerSingleton("UsersTestRepository", UsersTestRepository_1.UsersTestRepository);
    });
    it("should be able to create a new user", async () => {
        const user = {
            email: "test@mygameslist.com.br",
            password: "test123",
            username: "test-user666",
        };
        const response = await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: user.email,
            password: user.password,
            username: user.username,
        });
        const { id, gamesList, admin, email, password, username, created_at } = response.body;
        expect(response.status).toBe(201);
        expect(id).toMatch(regexes_1.UUID_V4_REGEX);
        expect(gamesList.id).toMatch(regexes_1.UUID_V4_REGEX);
        expect(gamesList.list).toEqual([]);
        expect(created_at).toBeDefined();
        expect(admin).toBe(false);
        expect(email).toBe(user.email);
        expect(password.length).toBe(60);
        expect(username).toBe(username);
    });
    it("should not be able to create a user with same email", async () => {
        const user1 = {
            email: "test@mygameslist.com.br",
            password: "test123",
            username: "test-user666",
        };
        const user2 = {
            email: user1.email,
            password: "test321",
            username: "diferrent-test-user",
        };
        const response1 = await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: user1.email,
            password: user1.password,
            username: user1.username,
        });
        const response2 = await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: user1.email,
            password: user2.password,
            username: user2.username,
        });
        expect(response1.status).toBe(201);
        expect(response2.status).toBe(400);
        expect(response2.body).toEqual({ message: error_messages_1.EMAIL_ALREADY_EXISTS_ERROR });
    });
    it("should not be able to create a new user with same username", async () => {
        const user1 = {
            email: "test@mygameslist.com.br",
            password: "test123",
            username: "test-user666",
        };
        const user2 = {
            email: "anyotheremail@mygameslist.com.br",
            password: "test321",
            username: user1.username,
        };
        const response1 = await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: user1.email,
            password: user1.password,
            username: user1.username,
        });
        const response2 = await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: user2.email,
            password: user2.password,
            username: user2.username,
        });
        expect(response1.status).toBe(201);
        expect(response2.status).toBe(400);
        expect(response2.body).toEqual({ message: error_messages_1.USERNAME_ALREADY_EXISTS_ERROR });
    });
    it("should not be able to create a user with username shorter than 4 characters", async () => {
        const response = await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: "test@mygameslist.com.br",
            password: "test123",
            username: "tes",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: error_messages_1.USERNAME_LENGTH_ERROR });
    });
    it("should not be able to create a user with username longer than 35 characters", async () => {
        const response = await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: "test@mygameslist.com.br",
            password: "test123",
            username: "leeroooooooyjeeeeeeenkiiiiiiiinnnsss",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: error_messages_1.USERNAME_LENGTH_ERROR });
    });
});
