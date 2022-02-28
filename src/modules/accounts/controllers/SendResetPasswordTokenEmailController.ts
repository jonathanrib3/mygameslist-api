import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { SendResetPasswordLinkEmailUseCase } from "@modules/accounts/useCases/send_reset_password_link_email/SendResetPasswordLinkEmailUseCase";

class SendResetPasswordTokenEmailController {
  async handle(request: Request, response: Response) {
    const { token_id, user_id } = request.reset_token;

    if (!token_id || user_id) {
      throw new AppError(500, "Sorry, something went wrong.");
    }

    const sendResetPasswordTokenEmailUseCase = container.resolve(
      SendResetPasswordLinkEmailUseCase
    );

    const message = await sendResetPasswordTokenEmailUseCase.execute({
      token_id,
      user_id,
    });

    return response.status(200).send({ message });
  }
}

export { SendResetPasswordTokenEmailController };
