import { NextFunction, Request, Response } from "express";
import request from "supertest";

import { AppError } from "@infra/errors/AppError";
import { app } from "@infra/http/server";
import { User } from "@modules/accounts/models/User";
import { UpdateUserUseCase } from "@modules/accounts/useCases/update_user/UpdateUserUseCase";
import {
  INVALID_TOKEN_ERROR,
  USERNAME_LENGTH_ERROR,
} from "@shared/constants/error_messages";
import { USER_UPDATED_SUCCESSFULLY } from "@shared/constants/successful_messages";
import { authentication } from "@shared/infra/http/middlewares/authentication";

import { user } from "../dummies/default_user_dummy";

jest.mock("@shared/infra/http/middlewares/authentication");

describe("update user integration tests", () => {
  it("PATCH /users/ - should be able to return 200 OK on trying to update an authenticated user's username", async () => {
    // Arrange

    (<jest.Mock>authentication).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        const [, user_id] = req.headers.authorization.split(" ");

        req.user = {
          id: user_id,
        };

        next();
      }
    );

    const newUsername = "test-user123";

    jest
      .spyOn(UpdateUserUseCase.prototype, "execute")
      .mockImplementation(async () => {
        const updated = new User();

        Object.assign(updated, user);

        updated.username = newUsername;

        return updated;
      });

    // Act

    const response = await request(app)
      .patch("/users")
      .set("authorization", `Bearer ${user.id}`)
      .send({
        username: newUsername,
      });

    // Assert

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: USER_UPDATED_SUCCESSFULLY,
      user_id: user.id,
    });
  });

  it("PATCH /users/ - should be able to return 200 OK on trying to update an authenticated user's password", async () => {
    // Arrange

    (<jest.Mock>authentication).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        const [, user_id] = req.headers.authorization.split(" ");

        req.user = {
          id: user_id,
        };

        next();
      }
    );

    const newPassword = "newpasswd321";

    jest
      .spyOn(UpdateUserUseCase.prototype, "execute")
      .mockImplementation(async () => {
        const updated = new User();

        Object.assign(updated, user);

        updated.password = newPassword;

        return updated;
      });

    // Act

    const response = await request(app)
      .patch("/users")
      .set("authorization", `Bearer ${user.id}`)
      .send({
        password: newPassword,
      });

    // Assert

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: USER_UPDATED_SUCCESSFULLY,
      user_id: user.id,
    });
  });

  it("PATCH /users/ - should be able to return 400 BAD REQUEST on trying to update an authenticated user's username shorter than 4 chars", async () => {
    // Arrange

    (<jest.Mock>authentication).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        const [, user_id] = req.headers.authorization.split(" ");

        req.user = {
          id: user_id,
        };

        next();
      }
    );

    const newUsername = "tes";

    jest
      .spyOn(UpdateUserUseCase.prototype, "execute")
      .mockImplementation(async () => {
        throw new AppError(400, USERNAME_LENGTH_ERROR);
      });

    // Act

    const response = await request(app)
      .patch("/users")
      .set("authorization", `Bearer ${user.id}`)
      .send({
        username: newUsername,
      });

    // Assert

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: USERNAME_LENGTH_ERROR });
  });

  it("PATCH /users/ - should be able to return 400 BAD REQUEST on trying to update an authenticated user's username longer than 35 chars", async () => {
    // Arrange

    (<jest.Mock>authentication).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        const [, user_id] = req.headers.authorization.split(" ");

        req.user = {
          id: user_id,
        };

        next();
      }
    );

    const newUsername = "areallyreallyreallyreallylongusername";

    jest
      .spyOn(UpdateUserUseCase.prototype, "execute")
      .mockImplementation(async () => {
        throw new AppError(400, USERNAME_LENGTH_ERROR);
      });

    // Act

    const response = await request(app)
      .patch("/users")
      .set("authorization", `Bearer ${user.id}`)
      .send({
        username: newUsername,
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

    const response = await request(app).patch("/users").send({
      username: "whatever",
      password: "test321",
    });

    // Assert

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: INVALID_TOKEN_ERROR });
  });
});
