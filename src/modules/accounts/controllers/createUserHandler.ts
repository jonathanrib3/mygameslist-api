import { Request, Response } from "express";
import { container } from "tsyringe";

import { ICreateUserReturnDTO } from "../dtos/ICreateUserReturnDTO";
import { CreateUserUseCase } from "../useCases/create_user/CreateUserUseCase";

async function createUserHandler(
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

  const user_info: ICreateUserReturnDTO = {
    username: user.username,
    gamesList: user.gamesList,
    created_at: user.created_at,
  };

  return response.status(201).send(user_info);
}

export { createUserHandler };
