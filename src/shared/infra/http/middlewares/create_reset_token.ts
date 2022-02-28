import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import { CreateResetPasswordTokenUseCase } from "@modules/accounts/useCases/create_reset_password_token/CreateResetPasswordTokenUseCase";

async function createResetToken(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { email } = request.body;

  const createResetPasswordTokenUseCase = container.resolve(
    CreateResetPasswordTokenUseCase
  );

  const created_token = await createResetPasswordTokenUseCase.execute(email);

  const { token_id, user_id } = created_token;

  request.reset_token = {
    token_id,
    user_id,
  };

  next();
}

export { createResetToken };
