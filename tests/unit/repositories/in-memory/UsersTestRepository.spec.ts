import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { user } from "@root/tests/dummies/default_user_dummy";

let usersTestRepository: UsersTestRepository;

describe("User in-memory repository tests suite", () => {
  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
  });

  describe("Create user method", () => {
    it("should be able to create a new user if both username and email aren't being used by another user", async () => {
      const { email, password, username, avatar } = user;

      const result = await usersTestRepository.create({
        email,
        password,
        username,
        avatar,
      });

      expect(result).toMatchObject({ email, password, username, avatar });
      expect(result.id).toBeDefined();
      expect(result.gamesList).toBeDefined();
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();
    });
  });
});
