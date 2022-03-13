import { Request, Response } from "express";
import request from "supertest";

import { createAuthSessionHandler } from "@modules/accounts/controllers/createAuthSessionHandler";
import { INVALID_LOGIN_ERROR } from "@shared/constants/error_messages";

import { user } from "../dummies/default_user_dummy";
import { testApp } from "./infra/http/test_server";

jest.mock("@modules/accounts/controllers/createAuthSessionHandler");

describe("create session integration tests", () => {
  it("POST /sessions/ - should be able to return 200 OK on trying to generate a new token with valid user credentials", async () => {
    // Arrange

    const token = "some valid token!";

    (<jest.Mock>createAuthSessionHandler).mockImplementation(
      (_request: Request, response: Response) =>
        response.status(200).send({ token })
    );

    // Act

    const token_response = await request(testApp).post("/sessions").send({
      email: user.email,
      password: user.password,
    });

    // Assert

    expect(token_response.status).toBe(200);
    expect(token_response.body).toEqual({ token });
  });

  it("POST /sessions/ - should be able to return 400 BAD REQUEST on trying to generate a new token with invalid user email", async () => {
    // Arrange

    (<jest.Mock>createAuthSessionHandler).mockImplementation(
      (_request: Request, response: Response) =>
        response.status(400).send({ message: INVALID_LOGIN_ERROR })
    );

    // Act

    const response = await request(testApp).post("/sessions").send({
      email: "anyinvalidemail@email.com",
      password: user.password,
    });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: INVALID_LOGIN_ERROR });
  });

  it("POST /sessions/ - should be able to return 400 BAD REQUEST on trying to generate a new token with invalid user password", async () => {
    // Arrange

    (<jest.Mock>createAuthSessionHandler).mockImplementation(
      (_request: Request, response: Response) =>
        response.status(400).send({ message: INVALID_LOGIN_ERROR })
    );

    // Act

    const response = await request(testApp).post("/sessions").send({
      email: user.email,
      password: "anyinvalidpasswd",
    });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: INVALID_LOGIN_ERROR });
  });
});
