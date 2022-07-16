import { IAddGameDTO } from "@modules/accounts/dtos/IAddGameDTO";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IGame } from "@modules/games/interfaces/IGame";

import { IUpdateGameDTO } from "../../games/dtos/IUpdateGameDTO";
import { IUpdateUserDTO } from "../dtos/IUpdateUserDTO";
import { User } from "../models/User";

interface IUsersRepository {
  addGameToList({ game, user_id }: IAddGameDTO): Promise<IGame[]>;
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  removeGameFromList(game_id: number, user_id: string): Promise<IGame[]>;
  update(data: IUpdateUserDTO): Promise<User>;
  updateAvatar(user_id: string, avatar: string): Promise<User>;
  updateGameFromList({
    game_id,
    status,
    user_id,
    score,
  }: IUpdateGameDTO): Promise<IGame[]>;
}

export { IUsersRepository };
