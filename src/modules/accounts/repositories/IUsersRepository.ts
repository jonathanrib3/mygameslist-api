import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";

import { User } from "../models/User";

interface IUsersRepository {
  create(data: ICreateUserDTO): User;
  findByEmail(email: string): User;
  findByUsername(username: string): User;
}

export { IUsersRepository };
