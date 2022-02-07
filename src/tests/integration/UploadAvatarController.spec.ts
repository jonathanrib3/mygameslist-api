import { resolve } from "path";
import request, { Response } from "supertest";

import { INVALID_TOKEN_ERROR } from "@shared/constants/error_messages";

import { testApp } from "./infra/http/test_server";

let token_response: Response;

describe("upload avatar integration tests", () => {
  beforeAll(async () => {
    await request(testApp).post("/users").send({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user321",
    });

    token_response = await request(testApp).post("/sessions").send({
      email: "test@mygameslist.com.br",
      password: "test123",
    });
  });
  it("should be able to upload avatar with an authenticated user", async () => {
    const { token } = token_response.body;

    const filepath = resolve(__dirname, "..", "./integration", "./images");

    const response = await request(testApp)
      .post("/users/avatar")
      .set("authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .attach("avatar", `${filepath}/test_foto.jpg`);

    expect(response.status).toBe(200);
    expect(response.body.updated_at).not.toBe(response.body.created_at);
    expect(response.body.avatar).toBeDefined();
  });
  it("should not be able to upload avatar with an not authenticated user", async () => {
    const filepath = resolve(__dirname, "..", "./integration", "./images");

    const response = await request(testApp)
      .post("/users/avatar")
      .set("Content-Type", "multipart/form-data")
      .attach("avatar", `${filepath}/test_foto.jpg`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(INVALID_TOKEN_ERROR);
  });
});
