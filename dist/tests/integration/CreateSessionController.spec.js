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
const JwtProvider_1 = require("@shared/containers/providers/implementations/JwtProvider");
const test_server_1 = require("./infra/http/test_server");
describe("create session integration tests", () => {
    beforeEach(() => {
        tsyringe_1.container.registerSingleton("UsersTestRepository", UsersTestRepository_1.UsersTestRepository);
        tsyringe_1.container.registerSingleton("JwtProvider", JwtProvider_1.JwtProvider);
    });
    it("should be able to generate a new token with valid user infos", async () => {
        await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: "test@mygameslist.com",
            username: "macomaco",
            password: "testpsswd",
        });
        const token_response = await (0, supertest_1.default)(test_server_1.testApp).post("/sessions").send({
            email: "test@mygameslist.com",
            password: "testpsswd",
        });
        expect(token_response.status).toBe(200);
        expect(token_response.body.token).toMatch(regexes_1.JWT_TOKEN_REGEX);
    });
    it("should not be able to generate a new token with invalid user email", async () => {
        await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: "test@mygameslist.com",
            username: "macomaco",
            password: "testpsswd",
        });
        const token_response = await (0, supertest_1.default)(test_server_1.testApp).post("/sessions").send({
            email: "test@mygameslist.com.br",
            password: "testpsswd",
        });
        expect(token_response.status).toBe(400);
        expect(token_response.body.message).toBe(error_messages_1.INVALID_LOGIN_ERROR);
    });
    it("should not be able to generate a new token with invalid user password", async () => {
        await (0, supertest_1.default)(test_server_1.testApp).post("/users").send({
            email: "test@mygameslist.com",
            username: "macomaco",
            password: "testpsswd",
        });
        const token_response = await (0, supertest_1.default)(test_server_1.testApp).post("/sessions").send({
            email: "test@mygameslist.com",
            password: "testpsswdd",
        });
        expect(token_response.status).toBe(400);
        expect(token_response.body.message).toBe(error_messages_1.INVALID_LOGIN_ERROR);
    });
});
