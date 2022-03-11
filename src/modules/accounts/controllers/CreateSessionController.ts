import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateAuthSessionUseCase } from "@modules/accounts/useCases/create_auth_session/CreateAuthSessionUseCase";

class CreateSessionController {
  async handle(
    request: Request,
    response: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { email, password } = request.body;

    const createSessionUseCase = container.resolve(CreateAuthSessionUseCase);

    const token = await createSessionUseCase.execute({ email, password });

    return response.status(200).send({ token });
  }
}

export { CreateSessionController };
