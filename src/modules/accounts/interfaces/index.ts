import { GameCurrentStatus } from "../enums";

interface IGame {
  id: string;
  cover: string;
  title: string;
  score: number;
  status: GameCurrentStatus;
  developer: string;
  publisher: string;
  platforms: string;
}

interface IGamesList {
  id: string;
  list: IGame[];
}

export { IGamesList, IGame };
