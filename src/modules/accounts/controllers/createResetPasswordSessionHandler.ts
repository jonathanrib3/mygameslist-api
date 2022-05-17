import { Request, Response } from "express";

import { getCreateResetPasswordSessionUseCase } from "@modules/accounts/factories/createResetPasswordSessionUseCaseFactory";
import { RESET_SESSION_CREATED_SUCCESSFULLY } from "@shared/constants/successful_messages";

export async function createResetPasswordSessionHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const { email } = request.body;

  const createResetPasswordSessionUseCase =
    getCreateResetPasswordSessionUseCase();

  await createResetPasswordSessionUseCase.execute(email);

  return response
    .status(200)
    .send({ message: RESET_SESSION_CREATED_SUCCESSFULLY });
}
