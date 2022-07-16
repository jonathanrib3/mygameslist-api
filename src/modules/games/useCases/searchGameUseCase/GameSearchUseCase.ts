import axios from "axios";
import { injectable } from "tsyringe";

import { client } from "@infra/database/redis/redis_client";
import { decryptAccessToken } from "@modules/games/useCases/utils/decryptAccessToken";
import { getNewAccessToken } from "@modules/games/useCases/utils/refreshAccessToken";

const client_id = process.env.API_AUTH_CLIENT_ID;

@injectable()
class GameSearchUseCase {
  constructor() {
    client.connect();
  }

  async execute(game_name: string, offset = 0): Promise<any> {
    let access_token = await client.GET("access_token");

    if (!access_token) {
      access_token = await getNewAccessToken();
    }

    const api_query = `search "${game_name}"; fields name, genres.name, cover.url, platforms.name, involved_companies.company.name; offset ${offset}; limit 100;`;

    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      api_query,
      {
        headers: {
          // eslint-disable-next-line prettier/prettier
          "Accept": "application/json",
          "Client-ID": client_id,
          // eslint-disable-next-line prettier/prettier
          "Authorization": `Bearer ${decryptAccessToken(access_token)}`,
        },
      }
    );

    return response.data;
  }
}

export { GameSearchUseCase };
