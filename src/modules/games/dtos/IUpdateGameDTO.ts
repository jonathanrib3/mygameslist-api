export interface IUpdateGameDTO {
  user_id: string;
  game_id: number;
  score?: number;
  status: string;
}
