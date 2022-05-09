import "@root/config.js";
import axios from "axios";

import { encryptAccessToken } from "@modules/games/useCases/utils/encryptAccessToken";
import { client } from "@shared/infra/database/redis/redis_client";

async function refreshAccessToken(): Promise<void> {
  const response = await axios({
    method: "POST",
    url: "https://id.twitch.tv/oauth2/token",
    params: {
      client_id: process.env.API_AUTH_CLIENT_ID,
      client_secret: process.env.API_AUTH_CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });

  const { access_token, expires_in } = response.data;

  const encrypted_token = encryptAccessToken(access_token);

  await client.SET("access_token", encrypted_token);
  await client.EXPIRE("access_token", Number(expires_in));
}

export { refreshAccessToken };
