import request from "supertest";
import { container } from "tsyringe";

import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";
import { UUID_V4_REGEX } from "@shared/constants/regexes";

import { testApp } from "./infra/http/test_server";

interface IRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

describe("create user integration tests", () => {
  beforeEach(() => {
    container.registerSingleton<IUsersRepository>(
      "UsersTestRepository",
      UsersTestRepository
    );
  });

  it("should be able to create a new user", async () => {
    const user: IRequest = {
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user666",
    };

    const response = await request(testApp).post("/users").send({
      email: user.email,
      password: user.password,
      username: user.username,
    });

    const { id, gamesList, admin, email, password, username, created_at } =
      response.body;

    expect(response.status).toBe(201);
    expect(id).toMatch(UUID_V4_REGEX);
    expect(gamesList.id).toMatch(UUID_V4_REGEX);
    expect(gamesList.list).toEqual([]);
    expect(created_at).toBeDefined();
    expect(admin).toBe(false);
    expect(email).toBe(user.email);
    expect(password.length).toBe(60);
    expect(username).toBe(username);
  });

  it("should not be able to create a user with same email", async () => {
    const user1: IRequest = {
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user666",
    };

    const user2: IRequest = {
      email: user1.email,
      password: "test321",
      username: "diferrent-test-user",
    };

    const response1 = await request(testApp).post("/users").send({
      email: user1.email,
      password: user1.password,
      username: user1.username,
    });

    const response2 = await request(testApp).post("/users").send({
      email: user1.email,
      password: user2.password,
      username: user2.username,
    });

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({ message: EMAIL_ALREADY_EXISTS_ERROR });
  });

  it("should not be able to create a new user with same username", async () => {
    const user1: IRequest = {
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user666",
    };

    const user2: IRequest = {
      email: "anyotheremail@mygameslist.com.br",
      password: "test321",
      username: user1.username,
    };

    const response1 = await request(testApp).post("/users").send({
      email: user1.email,
      password: user1.password,
      username: user1.username,
    });

    const response2 = await request(testApp).post("/users").send({
      email: user2.email,
      password: user2.password,
      username: user2.username,
    });

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({ message: USERNAME_ALREADY_EXISTS_ERROR });
  });

  it("should not be able to create a user with username shorter than 4 characters", async () => {
    const response = await request(testApp).post("/users").send({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "tes",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_LENGTH_ERROR });
  });

  it("should not be able to create a user with username longer than 35 characters", async () => {
    const response = await request(testApp).post("/users").send({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "leeroooooooyjeeeeeeenkiiiiiiiinnnsss",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_LENGTH_ERROR });
  });
});
