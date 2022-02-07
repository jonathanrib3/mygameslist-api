import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { User } from "@modules/accounts/models/User";

import { IUsersRepository } from "../IUsersRepository";

class UsersTestRepository implements IUsersRepository {
  private repository: User[];

  constructor() {
    this.repository = [];
  }

  async create({
    email,
    password,
    username,
    avatar,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      email,
      password,
      username,
      avatar,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.repository.push(user);

    return user;
  }

  async update({ id, password, username }: IUpdateUserDTO): Promise<User> {
    const user = await this.findById(id);

    user.username = username || user.username;
    user.password = password || user.password;

    return user;
  }

  async updateAvatar(user_id: string, avatar: string): Promise<User> {
    const user = await this.findById(user_id);

    user.avatar = avatar;
    user.updated_at = new Date();

    return user;
  }

  async findById(id: string): Promise<User> {
    return this.repository.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.find((user) => user.email === email);
  }

  async findByUsername(username: string): Promise<User> {
    return this.repository.find((user) => user.username === username);
  }
}

export { UsersTestRepository };
