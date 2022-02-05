import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateSessionUseCase } from "@modules/accounts/useCases/create_session/CreateSessionUseCase";

class CreateSessionController {
  async handle(
    request: Request,
    response: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { email, password } = request.body;

    const createSessionUseCase = container.resolve(CreateSessionUseCase);

    const token = await createSessionUseCase.execute({ email, password });

    return response.status(200).send({ token });
  }
}

export { CreateSessionController };
