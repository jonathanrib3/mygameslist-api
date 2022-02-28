import { Request, Response } from "express";
import { container } from "tsyringe";

import { ResetPasswordUseCase } from "../useCases/reset_password/ResetPasswordUseCase";

class ResetPasswordController {
  async handle(request: Request, response: Response) {
    const { password } = request.body;
    const { authorization } = request.headers;

    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    const update = await resetPasswordUseCase.execute(
      token as string,
      password
    );

    return response.status(200).send(update);
  }
}

export { ResetPasswordController };
