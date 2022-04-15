import { compareSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { ResetSession } from "@modules/accounts/models/ResetSession";
import { ISessionsRepository } from "@modules/accounts/repositories/ISessionsRepository";
import {
  INVALID_RESET_TOKEN_ERROR,
  RESET_SESSION_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";

const sessionsRepository = container.resolve<ISessionsRepository>(
  "MongoResetSessionsRepository"
);

function verifyTokenSecret(token_secret, session: ResetSession): void {
  const hashed_token_secret = session.token.token_secret;

  const isSecretTokenValid = compareSync(token_secret, hashed_token_secret);

  if (!isSecretTokenValid) {
    throw new AppError(401, INVALID_RESET_TOKEN_ERROR);
  }
}

async function findAndVerifyResetSession(session_id): Promise<ResetSession> {
  const session = await sessionsRepository.findById(session_id as string);

  if (!session) {
    throw new AppError(401, RESET_SESSION_NOT_FOUND_ERROR);
  }

  return session;
}

export async function validateResetSessionData(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { session_id } = request.query;
  const { token_secret } = request.headers;

  const session = await findAndVerifyResetSession(session_id);

  verifyTokenSecret(token_secret, session);

  request = session;

  next();
}
