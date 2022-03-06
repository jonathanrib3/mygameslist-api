import { v4 } from "uuid";

import { AppError } from "@infra/errors/AppError";
import { User } from "@modules/accounts/models/User";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { UploadAvatarUseCase } from "@modules/accounts/useCases/upload_avatar/UploadAvatarUseCase";
import { UPDATE_INVALID_USER_ERROR } from "@shared/constants/error_messages";

jest.mock("@modules/accounts/repositories/in-memory/UsersTestRepository");

describe("Upload Avatar Use Case", () => {
  let usersTestRepository: UsersTestRepository;
  let uploadAvatarUseCase: UploadAvatarUseCase;

  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
    uploadAvatarUseCase = new UploadAvatarUseCase(usersTestRepository);
  });

  it("should be able to store the image filename", async () => {
    const user = new User();

    Object.assign(user, {
      email: "test@mygameslist.com.br",
      password: "test123",
      username: "test-user",
      created_at: new Date(),
      updated_at: new Date(),
    });

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

    const result = await uploadAvatarUseCase.execute({
      user_id: user.id,
      filename,
    });

    expect(result.avatar).toBe(filename);
  });

  it("should not be able to upload an avatar to an non existent user", async () => {
    const fake_id = v4();

    (<jest.Mock>usersTestRepository.updateAvatar).mockImplementation(() => {
      throw new AppError(400, UPDATE_INVALID_USER_ERROR);
    });

    await expect(async () => {
      await uploadAvatarUseCase.execute({
        user_id: fake_id,
        filename: "random_avatar.png",
      });
    }).rejects.toThrow(UPDATE_INVALID_USER_ERROR);
  });
});
