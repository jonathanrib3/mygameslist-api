import { Request, Response } from "express";
import { container } from "tsyringe";

import { USER_UPDATED_SUCCESSFULLY } from "@shared/constants/successful_messages";

import { UpdateUserUseCase } from "../useCases/update_user/UpdateUserUseCase";

async function updateUserHandler(
  request: Request,
  response: Response
): Promise<Response<any, Record<string, any>>> {
  const { id } = request.user;
  const { username, password } = request.body;

  const updateUserUseCase = container.resolve(UpdateUserUseCase);

  const update = await updateUserUseCase.execute({ id, username, password });

  return response
    .status(200)
    .send({ message: USER_UPDATED_SUCCESSFULLY, user_id: update.id });
}

export { updateUserHandler };
