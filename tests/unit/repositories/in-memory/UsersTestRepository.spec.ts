import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { user } from "@root/tests/dummies/default_user_dummy";
import {
  EMAIL_ALREADY_EXISTS_ERROR,
  USERNAME_ALREADY_EXISTS_ERROR,
} from "@shared/constants/error_messages";
import { VALID_USER_DATA_MESSAGE } from "@shared/constants/successful_messages";

let usersTestRepository: UsersTestRepository;

describe("User in-memory repository tests suite", () => {
  beforeEach(() => {
    usersTestRepository = new UsersTestRepository();
  });

  describe("Create user method", () => {
    it("should be able to create a new user if both username and email aren't being used by another user", async () => {
      // Arrange
      const { email, password, username, avatar } = user;

      jest
        .spyOn(usersTestRepository, "validateUserToBeCreatedData")
        .mockReturnValue(Promise.resolve(VALID_USER_DATA_MESSAGE));

      // Act
      const result = await usersTestRepository.create({
        email,
        password,
        username,
        avatar,
      });

      // Assert
      expect(result.email).toBe(email);
    });

    it("should be able to update user with valid data", async () => {
      // Arrange
      const { id, password, username } = user;

      jest
        .spyOn(usersTestRepository, "validateUserToBeUpdatedData")
        .mockReturnValue(Promise.resolve(VALID_USER_DATA_MESSAGE));

      // Act

      await usersTestRepository.update({ id, password, username });

      
    });
  });

  describe("Create user method exceptions", () => {
    it("should not be able to create a new user with an already used email", () => {
      // Arrange
      const { email, password, username, avatar } = user;

      jest
        .spyOn(usersTestRepository, "validateUserToBeCreatedData")
        .mockReturnValue(Promise.resolve(EMAIL_ALREADY_EXISTS_ERROR));

      expect(async () => {
        // Act

        await usersTestRepository.create({ email, password, username, avatar });
        // Assert
      }).rejects.toThrow(EMAIL_ALREADY_EXISTS_ERROR);
    });

    it("should not be able to create a new user with an already used username", () => {
      // Arrange
      const { email, password, username, avatar } = user;

      jest
        .spyOn(usersTestRepository, "validateUserToBeCreatedData")
        .mockReturnValue(Promise.resolve(USERNAME_ALREADY_EXISTS_ERROR));

      expect(async () => {
        // Act

        await usersTestRepository.create({ email, password, username, avatar });
        // Assert
      }).rejects.toThrow(USERNAME_ALREADY_EXISTS_ERROR);
    });
  });
});
