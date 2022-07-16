import axios, { AxiosResponse } from "axios";

import { client } from "@infra/database/redis/redis_client";
import { GameSearchUseCase } from "@modules/games/useCases/searchGameUseCase/GameSearchUseCase";
import { decryptAccessToken } from "@modules/games/useCases/utils/decryptAccessToken";
import { getNewAccessToken } from "@modules/games/useCases/utils/refreshAccessToken";
import { game_data } from "@root/tests/dummies/default_api_game_data_dummy";

jest.mock("@modules/games/useCases/utils/decryptAccessToken");
jest.mock("@infra/database/redis/redis_client");
jest.mock("@modules/games/useCases/utils/refreshAccessToken");
jest.mock("@modules/games/useCases/utils/refreshAccessToken");

describe("game search use case unit tests", () => {
  let gameSearchUseCase: GameSearchUseCase;

  beforeEach(() => {
    gameSearchUseCase = new GameSearchUseCase();
  });

  it("should be able to search for a game", async () => {
    // Arrange

    const access_token = "aabc6973621cda983";
    const response: AxiosResponse = {
      status: 200,
      statusText: "OK",
      data: game_data,
      headers: undefined,
      config: undefined,
    };

    (<jest.Mock>client.GET).mockReturnValue(undefined);
    (<jest.Mock>decryptAccessToken).mockReturnValue(access_token);
    (<jest.Mock>getNewAccessToken).mockReturnValue(access_token);
    jest.spyOn(axios, "post").mockReturnValue(Promise.resolve(response));

    // Act

    const result = await gameSearchUseCase.execute("dark souls", 0);

    // Assert

    expect(result).toEqual(game_data);
  });
});
