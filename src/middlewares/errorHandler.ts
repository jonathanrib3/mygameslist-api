import { NextFunction, Request, Response } from "express";
import { AppError } from "src/errors/AppError";

const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return response.status(error.status).send({ message: error.message });
  }

  return response.status(500).send({ message: "Server internal error" });
};

export { errorHandler };
