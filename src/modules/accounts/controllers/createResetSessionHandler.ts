import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateResetSessionUseCase } from "@modules/accounts/useCases/create_reset_session/CreateResetSessionUseCase";
import { RESET_SESSION_CREATED_SUCCESSFULLY } from "@shared/constants/successful_messages";

export async function createResetSessionHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const { email } = request.body;

  const createResetSessionUseCase = container.resolve(
    CreateResetSessionUseCase
  );

  await createResetSessionUseCase.execute(email);

  return response
    .status(200)
    .send({ message: RESET_SESSION_CREATED_SUCCESSFULLY });
}
