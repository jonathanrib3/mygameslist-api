import { GameCurrentStatus } from "@modules/games/enums/index";

export interface IGame {
  id: string;
  cover_url: string;
  title: string;
  genre: string;
  score: number;
  status: GameCurrentStatus;
  involved_companies: string[];
  platforms: string[];
}
