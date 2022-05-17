import { GameCurrentStatus } from "@modules/games/enums/index";

export interface ICreateGameDTO {
  id: number;
  cover_url: string;
  title: string;
  score: number;
  status: GameCurrentStatus;
  involved_companies: string[];
  platforms: string[];
}
