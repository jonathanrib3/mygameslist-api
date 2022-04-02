// import { TokensTestRepository } from "@modules/accounts/repositories/in-memory/TokensTestRepository";
// import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
// import { ResetPasswordUseCase } from "@modules/accounts/useCases/reset_password/ResetPasswordUseCase";
// import { EXPIRED_TOKEN_ERROR } from "@shared/constants/error_messages";

// jest.mock("@modules/accounts/repositories/in-memory/UsersTestRepository");

// describe("reset password unit tests", () => {
//   let usersTestRepository: UsersTestRepository;
//   let tokensTestRepository: TokensTestRepository;
//   let resetPasswordUseCase: ResetPasswordUseCase;

//   beforeAll(async () => {
//     usersTestRepository = new UsersTestRepository();
//     tokensTestRepository = new TokensTestRepository();
//     resetPasswordUseCase = new ResetPasswordUseCase(
//       tokensTestRepository,
//       usersTestRepository
//     );
//   });

//   it("should be able to reset a password with a valid token", async () => {
//     const created_token = await createResetPasswordTokenUseCase.execute(
//       user.email
//     );

//     const old_password = user.password;

//     const update = await resetPasswordUseCase.execute(
//       created_token.token_id,
//       "newpasswd321"
//     );

//     expect(update.password).not.toBe(old_password);
//   });

//   it("should not be able to reset a password with an already expired token", async () => {
//     const created_token = await createResetPasswordTokenUseCase.execute(
//       user.email
//     );

//     const { token_id } = created_token;

//     await tokensTestRepository.setTokenToExpired(token_id);

//     expect(async () => {
//       await resetPasswordUseCase.execute(token_id, "newpasswd123");
//     }).rejects.toThrow(EXPIRED_TOKEN_ERROR);
//   });
// });
