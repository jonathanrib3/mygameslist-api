import { GameCurrentStatus } from "@modules/accounts/enums/index";

export interface IGame {
  id: string;
  cover: string;
  title: string;
  score: number;
  status: GameCurrentStatus;
  involved_companies: string[];
  platforms: string[];
}
