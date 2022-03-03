import request, { Response } from "supertest";

import { INVALID_TOKEN_ERROR } from "@shared/constants/error_messages";

import { testApp } from "./infra/http/test_server";

let token_response: Response;
let old_password: string;
let old_username: string;

describe("update user integration tests", () => {
  beforeAll(async () => {
    await request(testApp).post("/users").send({
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user321",
    });

    old_password = "test123";
    old_username = "test-user321";

    token_response = await request(testApp).post("/sessions").send({
      email: "test@mygameslist.com.br",
      password: "test123",
    });
  });

  it("should be able to update an authenticated user's username", async () => {
    const { token } = token_response.body;

    const response = await request(testApp)
      .patch("/users")
      .set("authorization", `Bearer ${token}`)
      .send({
        username: "test-user123",
      });

    expect(response.status).toBe(200);
    expect(response.body.username).not.toBe(old_username);
  });

  it("should be able to update an authenticated user's password", async () => {
    const { token } = token_response.body;

    const response = await request(testApp)
      .patch("/users")
      .set("authorization", `Bearer ${token}`)
      .send({
        password: "test321",
      });

    expect(response.status).toBe(200);
    expect(response.body.password).not.toBe(old_password);
  });

  it("should not be able to update an not authenticated user", async () => {
    const response = await request(testApp).patch("/users").send({
      username: "whatever",
      password: "test321",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(INVALID_TOKEN_ERROR);
  });
});
