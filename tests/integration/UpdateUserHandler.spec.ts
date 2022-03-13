import { NextFunction, Request, Response } from "express";
import request from "supertest";

import { updateUserHandler } from "@modules/accounts/controllers/updateUserHandler";
import {
  INVALID_TOKEN_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";
import { USER_UPDATED_SUCCESSFULLY } from "@shared/constants/successful_messages";
import { authentication } from "@shared/infra/http/middlewares/authentication";

import { user } from "../dummies/default_user_dummy";
import { testApp } from "./infra/http/test_server";

jest.mock("@shared/infra/http/middlewares/authentication");
jest.mock("@modules/accounts/controllers/updateUserHandler");

describe("update user integration tests", () => {
  it("PATCH /users/ - should be able to return 200 OK on trying to update an authenticated user's username", async () => {
    // Arrange

    const token = user.id;

    (<jest.Mock>authentication).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        const [, user_id] = req.headers.authorization.split(" ");

        req.user = {
          id: user_id,
        };

        next();
      }
    );

    (<jest.Mock>updateUserHandler).mockImplementation(
      (req: Request, res: Response) =>
        res
          .status(200)
          .send({ message: USER_UPDATED_SUCCESSFULLY, user_id: req.user.id })
    );

    // Act

    const response = await request(testApp)
      .patch("/users")
      .set("authorization", `Bearer ${token}`)
      .send({
        username: "test-user123",
      });

    // Act

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: USER_UPDATED_SUCCESSFULLY,
      user_id: token,
    });
  });

  it("PATCH /users/ - should be able to return 200 OK on trying to update an authenticated user's password", async () => {
    // Arrange

    const token = user.id;

    (<jest.Mock>authentication).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        const [, user_id] = req.headers.authorization.split(" ");

        req.user = {
          id: user_id,
        };

        next();
      }
    );

    (<jest.Mock>updateUserHandler).mockImplementation(
      (req: Request, res: Response) =>
        res.status(400).send({ message: USERNAME_LENGTH_ERROR })
    );

    // Act

    const response = await request(testApp)
      .patch("/users")
      .set("authorization", `Bearer ${token}`)
      .send({
        username: "tes",
      });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_LENGTH_ERROR });
  });

  it("PATCH /users/ - should be able to return 401 UNAUTHORIZED on trying to update an not authenticated user", async () => {
    // Arrange

    (<jest.Mock>authentication).mockImplementation(
      (req: Request, res: Response, _next: NextFunction) => {
        return res.status(401).send({ message: INVALID_TOKEN_ERROR });
      }
    );

    // Act

    const response = await request(testApp).patch("/users").send({
      username: "whatever",
      password: "test321",
    });

    // Assert

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: INVALID_TOKEN_ERROR });
  });
});
