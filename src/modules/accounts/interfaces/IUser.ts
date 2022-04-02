import { IGamesList } from "@modules/accounts/interfaces/index";

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
