import { NextFunction, Request, Response } from "express";

import { AppError } from "@shared/infra/errors/AppError";

function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
): Response<any, Record<string, any>> {
  if (error instanceof AppError) {
    return response.status(error.status).send({ message: error.message });
  }

  if (error.name === "MongoServerError") {
    return response.status(400).send({ message: error.message });
  }

  if (error.name === "MongoError") {
    return response.status(400).send({ message: error.message });
  }
  console.log(error);
  return response.status(500).send({ message: "Server internal error" });
}

export { errorHandler };
