import { IGamesList } from "../interfaces";

interface ICreateUserReturnDTO {
  id: string;
  username: string;
  gamesList: IGamesList;
  created_at: Date;
}

export { ICreateUserReturnDTO };
