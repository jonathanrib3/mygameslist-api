import request from "supertest";

import { AppError } from "@infra/errors/AppError";
import { app } from "@infra/http/server";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";

import { user } from "../dummies/default_user_dummy";

describe("create user routes", () => {
  it("POST /users/ - should be able to return 201 CREATED on creating a valid user", async () => {
    // Act

    const response = await request(app).post("/users").send({
      email: user.email,
      password: user.password,
      username: user.username,
    });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ username: user.username });
  });

  it("POST /users/ - should be able to return 400 BAD REQUEST on trying to create an user with an already existent email", async () => {
    // Arrange

    jest
      .spyOn(UsersTestRepository.prototype, "create")
      .mockImplementation(() => {
        throw new AppError(400, EMAIL_ALREADY_EXISTS_ERROR);
      });

    // Act

    const response = await request(app).post("/users").send({
      email: user.email,
      password: user.password,
      username: user.username,
    });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: EMAIL_ALREADY_EXISTS_ERROR });
  });

  it("POST /users/ - should be able to return 400 BAD REQUEST on trying to create a user with an already existent username", async () => {
    // Arrange

    jest
      .spyOn(UsersTestRepository.prototype, "create")
      .mockImplementation(() => {
        throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);
      });

    // Act

    const response = await request(app).post("/users").send({
      email: user.email,
      password: user.password,
      username: user.username,
    });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_ALREADY_EXISTS_ERROR });
  });

  it("POST /users/ - should be able to return 400 BAD REQUEST on trying to create an user with username shorter than 4 characters", async () => {
    // Act

    const response = await request(app).post("/users").send({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "tes",
    });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_LENGTH_ERROR });
  });

  it("POST /users/ - should be able to return 400 BAD REQUEST on trying to create an user with username longer than 35 characters", async () => {
    // Act

    const response = await request(app).post("/users").send({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "leeroooooooyjeeeeeeenkiiiiiiiinnnsss",
    });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_LENGTH_ERROR });
  });
});
