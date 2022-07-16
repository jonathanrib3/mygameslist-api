import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { GameCurrentStatus } from "@modules/games/enums/index";
import { IGame } from "@modules/games/interfaces/IGame";
import { UpdateGameFromListUseCase } from "@modules/games/useCases/updateGameFromList/UpdateGameFromListUseCase";
import { transformCurrentStatusFromStringToEnum } from "@modules/games/useCases/utils/transformCurrentStatusFromStringToEnum";
import game from "@root/tests/dummies/default_game_dummy";
import { user } from "@root/tests/dummies/default_user_dummy";

jest.mock(
  "@modules/games/useCases/utils/transformCurrentStatusFromStringToEnum"
);

describe("update game from list use case", () => {
  let usersTestRepository: UsersTestRepository;
  let updateGameFromListUseCase: UpdateGameFromListUseCase;

  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    updateGameFromListUseCase = new UpdateGameFromListUseCase(
      usersTestRepository
    );
  });

  it("should be able to update from list", async () => {
    // Arrange

    const { cover_url, genre, id, involved_companies, platforms, title } = game;
    const user_id = user.id;
    const game_id = game.id;
    const new_status = GameCurrentStatus.PAUSED;
    const new_score = 2.5;

    const updated_game: IGame = {
      id,
      cover_url,
      genre,
      involved_companies,
      platforms,
      title,
      score: new_score,
      status: new_status,
    };

    (<jest.Mock>transformCurrentStatusFromStringToEnum).mockReturnValue(
      new_status
    );

    jest
      .spyOn(usersTestRepository, "updateGameFromList")
      .mockReturnValue(Promise.resolve([updated_game]));

    // Act

    const result = await updateGameFromListUseCase.execute({
      user_id,
      game_id,
      score: new_score,
      status: new_status,
    });

    // Assert

    expect(result[0]).not.toEqual(game);
  });
});
