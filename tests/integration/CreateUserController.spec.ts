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
/*
  TODO: refatorar os controllers e transformar em funções
*/
jest.mock("@modules/accounts/controllers/createUserHandler");

describe("Create User Routes", () => {
  it("POST /users/ - should be able to create a user with valid username and email", async () => {
    (<jest.Mock>createUserHandler).mockImplementation(
      async (_request: Request, response: Response) =>
        response.status(201).send({
          username: user.username,
          gamesList: user.gamesList,
          created_at: user.created_at,
        })
    );

    const response = await request(testApp).post("/users").send({
      email: user.email,
      password: user.password,
      username: user.username,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      username: user.username,
      gamesList: user.gamesList,
      created_at: user.created_at.toISOString(),
    });
  });

  it("POST /users/ - should not be able to create a user with same email", async () => {
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

  it("POST /users/ - should not be able to create a new user with same username", async () => {
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

  it("POST /users/ - should not be able to create a user with username shorter than 4 characters", async () => {
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

  it("POST /users/ - should not be able to create a user with username longer than 35 characters", async () => {
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
