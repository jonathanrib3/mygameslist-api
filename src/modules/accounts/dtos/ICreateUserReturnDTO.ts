import { IGamesList } from "../interfaces";

interface ICreateUserReturnDTO {
  username: string;
  gamesList: IGamesList;
  created_at: Date;
}

export { ICreateUserReturnDTO };
