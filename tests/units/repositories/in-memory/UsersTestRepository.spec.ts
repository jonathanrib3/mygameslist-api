import { User } from "@modules/accounts/models/User";
import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { VALID_USER_DATA_MESSAGE } from "@shared/constants/successful_messages";

jest.mock("@modules/accounts/repositories/in-memory/UsersTestRepository");

describe("User in-memory repository", () => {
  describe("Create user method", () => {
    const usersTestRepository = new UsersTestRepository();

    it("should be able to create a new user if both username and email aren't being used by another user", async () => {
      const user = new User();

      Object.assign(user, {
        email: "test@mygameslist.com.br",
        password: "test123",
        username: "test-user",
        avatar: "test-avatar",
        admin: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      (<jest.Mock>(
        usersTestRepository.validateUserDataBeingAlreadyInUse
      )).mockReturnValue(VALID_USER_DATA_MESSAGE);

      const result = await usersTestRepository.create({
        email: user.email,
        password: user.password,
        username: user.username,
        avatar: user.avatar,
      });

      expect(result).toEqual(user);
    });
  });
});
