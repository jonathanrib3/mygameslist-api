import { Request, Response } from "express";
import { container } from "tsyringe";

import { ResetPasswordUseCase } from "../useCases/reset_password/ResetPasswordUseCase";

async function resetPasswordHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const { new_password } = request.body;
  const { token_secret } = request.headers;
  const { session_id } = request.query;

  const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

  const update = await resetPasswordUseCase.execute({
    session_id,
    token_secret,
    new_password,
  });

  return response.status(200).send(update);
}

export { resetPasswordHandler };
