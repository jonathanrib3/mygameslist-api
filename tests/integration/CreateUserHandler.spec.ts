import { Request, Response } from "express";
import request from "supertest";

import { createUserHandler } from "@modules/accounts/controllers/createUserHandler";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";

import { user } from "../dummies/default_user_dummy";
import { testApp } from "./infra/http/test_server";

jest.mock("@modules/accounts/controllers/createUserHandler");

describe("create user routes", () => {
  it("POST /users/ - should be able to return 201 CREATED on creating a valid user", async () => {
    // Arrange

    (<jest.Mock>createUserHandler).mockImplementation(
      async (_request: Request, response: Response) =>
        response.status(201).send({
          username: user.username,
          gamesList: user.gamesList,
          created_at: user.created_at,
        })
    );

    // Act

    const response = await request(testApp).post("/users").send({
      email: user.email,
      password: user.password,
      username: user.username,
    });

    // Assert

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      username: user.username,
      gamesList: user.gamesList,
      created_at: user.created_at.toISOString(),
    });
  });

  it("POST /users/ - should be able to return 400 BAD REQUEST on trying to create an user with an already existent email", async () => {
    (<jest.Mock>createUserHandler).mockImplementation(
      async (_request: Request, response: Response) =>
        response.status(400).send({ message: EMAIL_ALREADY_EXISTS_ERROR })
    );

    const response = await request(testApp).post("/users").send({
      email: user.email,
      password: user.password,
      username: user.username,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: EMAIL_ALREADY_EXISTS_ERROR });
  });

  it("POST /users/ - should be able to return 400 BAD REQUEST on trying to create a user with an already existent username", async () => {
    (<jest.Mock>createUserHandler).mockImplementation(
      async (_request: Request, response: Response) =>
        response.status(400).send({ message: USERNAME_ALREADY_EXISTS_ERROR })
    );

    const response = await request(testApp).post("/users").send({
      email: user.email,
      password: user.password,
      username: user.username,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_ALREADY_EXISTS_ERROR });
  });

  it("POST /users/ - should be able to return 400 BAD REQUEST on trying to create an user with username shorter than 4 characters", async () => {
    (<jest.Mock>createUserHandler).mockImplementation(
      async (_request: Request, response: Response) =>
        response.status(400).send({ message: USERNAME_LENGTH_ERROR })
    );

    const response = await request(testApp).post("/users").send({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "tes",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_LENGTH_ERROR });
  });

  it("POST /users/ - should be able to return 400 BAD REQUEST on trying to create an user with username longer than 35 characters", async () => {
    (<jest.Mock>createUserHandler).mockImplementation(
      async (_request: Request, response: Response) =>
        response.status(400).send({ message: USERNAME_LENGTH_ERROR })
    );

    const response = await request(testApp).post("/users").send({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "leeroooooooyjeeeeeeenkiiiiiiiinnnsss",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_LENGTH_ERROR });
  });
});
