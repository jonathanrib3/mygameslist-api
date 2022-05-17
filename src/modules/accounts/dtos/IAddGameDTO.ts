import { IGame } from "@modules/games/interfaces/IGame";

export interface IAddGameDTO {
  game: IGame;
  user_id: string;
}
