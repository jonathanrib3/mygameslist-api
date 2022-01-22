import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/models/User";

import { IUsersRepository } from "../IUsersRepository";

class UsersTestRepository implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  create({ email, password, username, avatar }: ICreateUserDTO): User {
    const user = new User();

    Object.assign(user, {
      email,
      password,
      username,
      avatar,
      created_at: new Date(),
    });

    this.users.push(user);

    return user;
  }

  findByEmail(email: string): User {
    const userToBeFound = this.users.find((user) => user.email === email);

    return userToBeFound;
  }
}

export { UsersTestRepository };
