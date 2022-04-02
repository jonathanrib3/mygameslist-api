import { v4 } from "uuid";

import { connectMongo } from "@infra/database/mongodb/connect_to_mongo";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { User } from "@modules/accounts/models/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { UserModel } from "../../models/mongodb/models/UserModel";

export class MongoUsersRepository implements IUsersRepository {
  private repository = UserModel;

  constructor() {
    connectMongo();
  }

  async create({
    email,
    password,
    username,
    avatar,
  }: ICreateUserDTO): Promise<User> {
    const newUser = await this.repository.create({
      _id: v4(),
      admin: false,
      email,
      password,
      gamesList: {
        _id: v4(),
        list: [],
      },
      username,
      avatar,
    });

    const idAsString = String(newUser._id);

    return this.findById(idAsString);
  }

  update(data: IUpdateUserDTO): Promise<User> {
    throw new Error("Method not implemented.");
  }

  updateAvatar(user_id: string, avatar: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<User> {
    return this.repository.findById<User>(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOne<User>({ email });
  }

  async findByUsername(username: string): Promise<User> {
    return this.repository.findOne<User>({ username });
  }
}
