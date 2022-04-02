import request from "supertest";

import { AppError } from "@infra/errors/AppError";
import { app } from "@infra/http/server";
import { CreateAuthSessionUseCase } from "@modules/accounts/useCases/create_auth_session/CreateAuthSessionUseCase";
import { INVALID_LOGIN_ERROR } from "@shared/constants/error_messages";

import { user } from "../dummies/default_user_dummy";

describe("create session integration tests", () => {
  it("POST /sessions/ - should be able to return 200 OK on trying to generate a new token with valid user credentials", async () => {
    // Arrange

    const token = "some valid token!";

    jest
      .spyOn(CreateAuthSessionUseCase.prototype, "execute")
      .mockImplementation(async () => token);

    // Act

    const token_response = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });

    // Assert

    expect(token_response.status).toBe(200);
    expect(token_response.body).toEqual({ token });
  });

  it("POST /sessions/ - should be able to return 400 BAD REQUEST on trying to generate a new token with invalid user email", async () => {
    // Arrange

    jest
      .spyOn(CreateAuthSessionUseCase.prototype, "execute")
      .mockImplementation(async () => {
        throw new AppError(400, INVALID_LOGIN_ERROR);
      });

    // Act

    const response = await request(app).post("/sessions").send({
      email: "anyinvalidemail@email.com",
      password: user.password,
    });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: INVALID_LOGIN_ERROR });
  });

  it("POST /sessions/ - should be able to return 400 BAD REQUEST on trying to generate a new token with invalid user password", async () => {
    // Arrange

    jest
      .spyOn(CreateAuthSessionUseCase.prototype, "execute")
      .mockImplementation(async () => {
        throw new AppError(400, INVALID_LOGIN_ERROR);
      });

    // Act

    const response = await request(app).post("/sessions").send({
      email: user.email,
      password: "anyinvalidpasswd",
    });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: INVALID_LOGIN_ERROR });
  });
});
