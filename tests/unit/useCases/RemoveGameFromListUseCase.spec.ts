import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { IGame } from "@modules/games/interfaces/IGame";
import { RemoveGameFromListUseCase } from "@modules/games/useCases/removeGameFromList/RemoveGameFromListUseCase";
import game from "@root/tests/dummies/default_game_dummy";
import { user } from "@root/tests/dummies/default_user_dummy";

describe("delete game from list use case unit tests", () => {
  let usersTestRepository: UsersTestRepository;
  let removeGameFromListUseCase: RemoveGameFromListUseCase;

  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    removeGameFromListUseCase = new RemoveGameFromListUseCase(
      usersTestRepository
    );
  });

  it("should be able to delete an existing game from an valid user's list", async () => {
    // Arrange
    const empty_games_list: IGame[] = [];

    jest
      .spyOn(usersTestRepository, "removeGameFromList")
      .mockReturnValue(Promise.resolve(empty_games_list));

    // Act

    const result = await removeGameFromListUseCase.execute(game.id, user.id);

    // Assert

    expect(result.length).toBe(0);
  });
});
