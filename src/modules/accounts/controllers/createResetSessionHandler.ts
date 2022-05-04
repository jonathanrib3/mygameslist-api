import { Request, Response } from "express";

import { getCreateResetSessionUseCase } from "@modules/accounts/factories/createResetSessionUseCaseFactory";
import { RESET_SESSION_CREATED_SUCCESSFULLY } from "@shared/constants/successful_messages";

export async function createResetSessionHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const { email } = request.body;

  const createResetSessionUseCase = getCreateResetSessionUseCase();

  await createResetSessionUseCase.execute(email);

  return response
    .status(200)
    .send({ message: RESET_SESSION_CREATED_SUCCESSFULLY });
}
