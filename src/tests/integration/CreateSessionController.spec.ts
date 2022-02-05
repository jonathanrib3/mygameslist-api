import request from "supertest";
import { container } from "tsyringe";

import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { INVALID_LOGIN_ERROR } from "@shared/constants/error_messages";
import { JWT_TOKEN_REGEX } from "@shared/constants/regexes";
import { JwtProvider } from "@shared/containers/providers/implementations/JwtProvider";

import { testApp } from "./infra/http/test_server";

describe("create session integration tests", () => {
  beforeEach(() => {
    container.registerSingleton<IUsersRepository>(
      "UsersTestRepository",
      UsersTestRepository
    );
    container.registerSingleton("JwtProvider", JwtProvider);
  });

  it("should be able to generate a new token with valid user infos", async () => {
    await request(testApp).post("/users").send({
      email: "test@mygameslist.com",
      username: "macomaco",
      password: "testpsswd",
    });

    const token_response = await request(testApp).post("/sessions").send({
      email: "test@mygameslist.com",
      password: "testpsswd",
    });

    expect(token_response.status).toBe(200);
    expect(token_response.body.token).toMatch(JWT_TOKEN_REGEX);
  });

  it("should not be able to generate a new token with invalid user email", async () => {
    await request(testApp).post("/users").send({
      email: "test@mygameslist.com",
      username: "macomaco",
      password: "testpsswd",
    });

    const token_response = await request(testApp).post("/sessions").send({
      email: "test@mygameslist.com.br",
      password: "testpsswd",
    });

    expect(token_response.status).toBe(400);
    expect(token_response.body.message).toBe(INVALID_LOGIN_ERROR);
  });

  it("should not be able to generate a new token with invalid user password", async () => {
    await request(testApp).post("/users").send({
      email: "test@mygameslist.com",
      username: "macomaco",
      password: "testpsswd",
    });

    const token_response = await request(testApp).post("/sessions").send({
      email: "test@mygameslist.com",
      password: "testpsswdd",
    });

    expect(token_response.status).toBe(400);
    expect(token_response.body.message).toBe(INVALID_LOGIN_ERROR);
  });
});
