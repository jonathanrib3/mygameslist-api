import { GameCurrentStatus } from "@modules/games/enums/index";
import { IGame } from "@modules/games/interfaces/IGame";

const game: IGame = {
  cover_url:
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1424240/capsule_616x353.jpg?t=1600967237",
  genre: "Adventure",
  id: 2508,
  involved_companies: ["Sinned Games"],
  platforms: ["Steam"],
  score: 5,
  status: GameCurrentStatus.FINISHED,
  title: "Mineirinho Ultra Adventures",
};

export default game;
