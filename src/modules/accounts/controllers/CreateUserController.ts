import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "../useCases/create_user/CreateUserUseCase";

class CreateUserController {
  async handle(
    request: Request,
    response: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { username, email, password, avatar } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      username,
      email,
      password,
      avatar,
    });

    return response.status(201).send(user);
  }
}

export { CreateUserController };
