import { IGamesList } from "@modules/games/interfaces/IGamesList";

export interface IUser {
  id: string;

  username: string;

  email: string;

  password: string;

  avatar: string;

  gamesList: IGamesList;

  admin: boolean;

  created_at: Date;

  updated_at: Date;
}
