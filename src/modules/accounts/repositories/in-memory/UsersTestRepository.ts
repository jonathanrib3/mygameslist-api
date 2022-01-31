import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/models/User";

import { IUsersRepository } from "../IUsersRepository";

class UsersTestRepository implements IUsersRepository {
  private repository: User[];

  constructor() {
    this.repository = [];
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

    this.repository.push(user);

    return user;
  }

  findByEmail(email: string): User {
    return this.repository.find((user) => user.email === email);
  }

  findByUsername(username: string): User {
    return this.repository.find((user) => user.username === username);
  }
}

export { UsersTestRepository };
