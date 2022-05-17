import { AppError } from "@infra/errors/AppError";
import { IAddGameDTO } from "@modules/accounts/dtos/IAddGameDTO";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { User } from "@modules/accounts/models/User";
import { IGame } from "@modules/games/interfaces/IGame";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  INTERNAL_SERVER_ERROR,
  UPDATE_INVALID_USER_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from "@shared/constants/error_messages";
import { VALID_USER_DATA_MESSAGE } from "@shared/constants/successful_messages";

import { IUsersRepository } from "../../IUsersRepository";

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
    const validation = await this.validateUserToBeCreatedData(email, username);

    switch (validation) {
      case EMAIL_ALREADY_EXISTS_ERROR:
        throw new AppError(400, EMAIL_ALREADY_EXISTS_ERROR);

      case USERNAME_ALREADY_EXISTS_ERROR:
        throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);

      case VALID_USER_DATA_MESSAGE: {
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

      default:
        throw new AppError(500, INTERNAL_SERVER_ERROR);
    }
  }

  async validateUserToBeCreatedData(
    email: string,
    username: string
  ): Promise<string> {
    const promiseEmailAlreadyBeingUsed = this.findByEmail(email);

    const promiseUsernameAlreadyBeingUsed = this.findByUsername(username);

    const [emailAlreadyBeingUsed, usernameAlreadyBeingUsed] = await Promise.all(
      [promiseEmailAlreadyBeingUsed, promiseUsernameAlreadyBeingUsed]
    );

    if (emailAlreadyBeingUsed) {
      return EMAIL_ALREADY_EXISTS_ERROR;
    }
    if (usernameAlreadyBeingUsed) {
      return USERNAME_ALREADY_EXISTS_ERROR;
    }

    return VALID_USER_DATA_MESSAGE;
  }

  async update({ id, password, username }: IUpdateUserDTO): Promise<User> {
    const user = await this.findById(id);

    if (!username) {
      user.password = password || user.password;

      return user;
    }
    const validation = await this.validateUserToBeUpdatedData(id, username);

    switch (validation) {
      case UPDATE_INVALID_USER_ERROR:
        throw new AppError(400, UPDATE_INVALID_USER_ERROR);

      case USERNAME_ALREADY_EXISTS_ERROR:
        throw new AppError(400, USERNAME_ALREADY_EXISTS_ERROR);

      case VALID_USER_DATA_MESSAGE: {
        user.username = username;
        user.password = password || user.password;
        user.updated_at = new Date();

        return user;
      }

      default:
        throw new AppError(500, INTERNAL_SERVER_ERROR);
    }
  }

  async validateUserToBeUpdatedData(
    íd: string,
    username: string
  ): Promise<string> {
    const promiseUserExists = this.findById(íd);

    const promiseUsernameAlreadyExists = this.findByUsername(username);

    const [userExists, usernameAlreadyExists] = await Promise.all([
      promiseUserExists,
      promiseUsernameAlreadyExists,
    ]);

    if (!userExists) {
      return UPDATE_INVALID_USER_ERROR;
    }

    if (usernameAlreadyExists) {
      return USERNAME_ALREADY_EXISTS_ERROR;
    }

    return VALID_USER_DATA_MESSAGE;
  }

  async updateAvatar(user_id: string, avatar: string): Promise<User> {
    const user = await this.findById(user_id);

    if (!user) {
      throw new AppError(400, UPDATE_INVALID_USER_ERROR);
    }

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

  async addGameToList({ game, user_id }: IAddGameDTO): Promise<IGame[]> {
    const user = await this.findById(user_id);

    if (!user) {
      throw new AppError(400, USER_NOT_FOUND_ERROR);
    }

    user.gamesList.list.push(game);

    return user.gamesList.list;
  }

  async removeGameFromList(game_id: number, user_id: string): Promise<IGame[]> {
    const user = await this.findById(user_id);

    user.gamesList.list = user.gamesList.list.filter(
      (game) => game.id !== game_id
    );

    return user.gamesList.list;
  }
}

export { UsersTestRepository };
