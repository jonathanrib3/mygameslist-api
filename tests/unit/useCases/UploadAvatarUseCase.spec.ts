import { v4 } from "uuid";

import { AppError } from "@infra/errors/AppError";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { UploadAvatarUseCase } from "@modules/accounts/useCases/upload_avatar/UploadAvatarUseCase";
import { UPDATE_INVALID_USER_ERROR } from "@shared/constants/error_messages";

import { user } from "../../dummies/default_user_dummy";

jest.mock(
  "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository"
);

describe("Upload Avatar Use Case", () => {
  let usersTestRepository: UsersTestRepository;
  let uploadAvatarUseCase: UploadAvatarUseCase;

  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    uploadAvatarUseCase = new UploadAvatarUseCase(usersTestRepository);
  });

  it("should be able to store the image filename", async () => {
    // Arrange

    const filename = "random_avatar.png";

    (<jest.Mock>usersTestRepository.updateAvatar).mockReturnValue({
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
      avatar: filename,
      gamesList: {
        id: user.gamesList.id,
        list: [],
      },
      admin: user.admin,
      created_at: user.created_at,
      updated_at: new Date(),
    });

    // Act

    const result = await uploadAvatarUseCase.execute({
      user_id: user.id,
      filename,
    });

    // Assert

    expect(result.avatar).toBe(filename);
  });

  it("should not be able to upload an avatar to an non existent user", async () => {
    // Arrange

    const fake_id = v4();

    (<jest.Mock>usersTestRepository.updateAvatar).mockImplementation(() => {
      throw new AppError(400, UPDATE_INVALID_USER_ERROR);
    });

    // Act

    await expect(async () => {
      await uploadAvatarUseCase.execute({
        user_id: fake_id,
        filename: "random_avatar.png",
      });
      // Assert
    }).rejects.toThrow(UPDATE_INVALID_USER_ERROR);
  });
});
