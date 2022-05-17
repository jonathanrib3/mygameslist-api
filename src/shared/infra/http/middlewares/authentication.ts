import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
  INVALID_TOKEN_ERROR,
  USER_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { JwtProvider } from "@shared/containers/providers/implementations/JwtProvider";

async function authentication(
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> {
  const jwtProvider = new JwtProvider();
  const usersRepository = container.resolve<IUsersRepository>(
    "MongoUsersRepository"
  );

  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError(401, INVALID_TOKEN_ERROR);
  }

  const [, token] = authorization.split(" ");

  const decoded = jwtProvider.decode<IUserToken>(token);

  const user_exists = await usersRepository.findById(decoded.data.user_id);

  if (!user_exists) {
    throw new AppError(401, USER_NOT_FOUND_ERROR);
  }

  request.user = {
    id: user_exists.id,
  };

  next();
}

export { authentication };
