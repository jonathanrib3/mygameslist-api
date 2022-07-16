import { User } from "@modules/accounts/models/User";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { AddGameToListUseCase } from "@modules/games/useCases/addGameToList/AddGameToListUseCase";
import { transformCurrentStatusFromStringToEnum } from "@modules/games/useCases/utils/transformCurrentStatusFromStringToEnum";
import game from "@root/tests/dummies/default_game_dummy";
import { user } from "@root/tests/dummies/default_user_dummy";

jest.mock(
  "@modules/games/useCases/utils/transformCurrentStatusFromStringToEnum"
);

describe("add game to list use case unit tests", () => {
  let usersTestRepository: UsersTestRepository;
  let addGameToListUseCase: AddGameToListUseCase;

  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    addGameToListUseCase = new AddGameToListUseCase(usersTestRepository);
  });

  it("should be able to add a valid game to a valid user's list", async () => {
    const user_data = new User();

    Object.assign(user_data, user);

    (<jest.Mock>transformCurrentStatusFromStringToEnum).mockReturnValue(
      game.status
    );

    jest
      .spyOn(usersTestRepository, "addGameToList")
      .mockReturnValue(Promise.resolve([game]));

    const result = await addGameToListUseCase.execute({
      game,
      user_id: user_data.id,
    });

    expect(result).toContainEqual(game);
  });
});
