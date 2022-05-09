import { GameCurrentStatus } from "@modules/games/enums/index";

export interface ICreateGameDTO {
  id: string;
  cover: string;
  title: string;
  score: number;
  status: GameCurrentStatus;
  involved_companies: string[];
  platforms: string[];
}
