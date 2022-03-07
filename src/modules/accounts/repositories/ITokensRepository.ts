import { ResetToken } from "../models/ResetToken";

interface ITokensRepository {
  create(
    token_id: string,
    user_id: string
  ): Promise<{ token_id: string; user_id: string }>;
  findByUserId(user_id: string): Promise<ResetToken>;
  findByToken(token_id: string): Promise<ResetToken>;
}

export { ITokensRepository };
