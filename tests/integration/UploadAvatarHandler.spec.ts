import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import request from "supertest";

import { uploadAvatarHandler } from "@modules/accounts/controllers/uploadAvatarHandler";
import { INVALID_TOKEN_ERROR } from "@shared/constants/error_messages";
import { authentication } from "@shared/infra/http/middlewares/authentication";

import { avatar } from "../dummies/default_avatar_file_dummy";
import { user } from "../dummies/default_user_dummy";
import { testApp } from "./infra/http/test_server";

const request_filename = `${crypto.randomBytes(8).toString("hex")} - ${
  avatar.filename
}`;

jest.mock("@shared/infra/http/middlewares/authentication");

jest.mock("@modules/upload_config/local_upload");

/*
  O multer trabalha com uma factory que provê um middleware
  de acordo com o método de upload de arquivo que você 
  escolhe. Por isso pra mockar ele é preciso, primeiro,
  mockar essa factory que provê o método que você quer usar.
*/
jest.mock("multer", () => {
  const multer = (_uploadConfig: any) => ({
    single: () => {
      return (req: Request, res: Response, next: NextFunction) => {
        req.file = {
          buffer: avatar.buffer,
          originalname: avatar.filename,
          mimetype: "multipart/form-data",
          destination: "/test-destination-folder",
          fieldname: "avatar",
          filename: request_filename,
          path: "/test-origin-folder",
          size: avatar.size,
          stream: req,
          encoding: "gzip",
        };
        return next();
      };
    },
  });
  multer.memoryStorage = () => jest.fn();
  return multer;
});

jest.mock("@modules/accounts/controllers/uploadAvatarHandler");

describe("upload avatar routes", () => {
  it("PATCH /users/avatar/ - should be able to return 200 OK on trying to upload an avatar with an authenticated user", async () => {
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

    (<jest.Mock>uploadAvatarHandler).mockImplementation(
      (req: Request, res: Response) =>
        res
          .status(200)
          .send({ user_id: token, file_uploaded: req.file.filename })
    );

    // Act

    const response = await request(testApp)
      .patch("/users/avatar")
      .set("authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .attach("avatar", avatar.buffer);

    // Assert

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user_id: token,
      file_uploaded: request_filename,
    });
  });

  it("PATCH /users/avatar/ - should be able to return 401 UNAUTHORIZED on trying to upload an avatar with an non authenticated user", async () => {
    // Arrange

    (<jest.Mock>authentication).mockImplementation(
      (req: Request, res: Response, _next: NextFunction) =>
        res.status(401).send({ message: INVALID_TOKEN_ERROR })
    );

    // Act

    const response = await request(testApp)
      .patch("/users/avatar")
      .set("Content-Type", "multipart/form-data")
      .attach("avatar", avatar.buffer);

    // Assert

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: INVALID_TOKEN_ERROR });
  });
});
