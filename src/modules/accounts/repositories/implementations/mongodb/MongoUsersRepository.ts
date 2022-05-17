import { v4 } from "uuid";

import { connectMongo } from "@infra/database/mongodb/connect_to_mongo";
import { AppError } from "@infra/errors/AppError";
import { IAddGameDTO } from "@modules/accounts/dtos/IAddGameDTO";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { UserModel } from "@modules/accounts/models/mongodb/models/UserModel";
import { User } from "@modules/accounts/models/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUpdateGameDTO } from "@modules/games/dtos/IUpdateGameDTO";
import { IGame } from "@modules/games/interfaces/IGame";
import { USER_NOT_FOUND_ERROR } from "@shared/constants/error_messages";

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
      },
      username,
      avatar,
    });

    const idAsString = String(newUser._id);

    return this.findById(idAsString);
  }

  async update({ id, password, username }: IUpdateUserDTO): Promise<User> {
    const user_to_update = await this.findById(id);

    await this.repository.updateOne(
      { _id: id },
      {
        username: username || user_to_update.username,
        password: password || user_to_update.password,
      }
    );

    return this.findById(id);
  }

  async updateAvatar(user_id: string, avatar: string): Promise<User> {
    await this.repository.updateOne(
      { _id: user_id },
      {
        avatar,
      }
    );

    return this.findById(user_id);
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findById<User>(id);

    if (!user) {
      throw new AppError(400, USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne<User>({ email });

    if (!user) {
      throw new AppError(400, USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.repository.findOne<User>({ username });

    if (!user) {
      throw new AppError(400, USER_NOT_FOUND_ERROR);
    }

    return user;
  }

  async addGameToList({ game, user_id }: IAddGameDTO): Promise<IGame[]> {
    const {
      cover_url,
      genre,
      title,
      score,
      status,
      involved_companies,
      platforms,
      id,
    } = game;

    await this.repository.updateOne(
      { _id: user_id },
      {
        $push: {
          "gamesList.list": {
            _id: id,
            title,
            genre,
            status,
            score,
            involved_companies,
            platforms,
            cover_url,
          },
        },
      }
    );

    const user = await this.findById(user_id);

    return user.gamesList.list;
  }

  async removeGameFromList(game_id: number, user_id: string): Promise<IGame[]> {
    await this.repository.updateOne(
      { _id: user_id },
      {
        $pull: {
          "gamesList.list": {
            _id: game_id,
          },
        },
      }
    );

    const user = await this.findById(user_id);

    return user.gamesList.list;
  }

  async updateGameFromList({
    game_id,
    status,
    user_id,
    score,
  }: IUpdateGameDTO): Promise<IGame[]> {
    await this.repository.updateOne(
      { $and: [{ _id: user_id }, { "gamesList.list._id": game_id }] },
      {
        "gamesList.list.$.score": score,
        "gamesList.list.$.status": status,
      }
    );

    const user = await this.findById(user_id);

    return user.gamesList.list;
  }
}
