import { Token } from "../models/Token";

interface ITokensRepository {
  create(token_id: string, user_id: string): void;
  findByUserId(user_id: string): Promise<Token>;
  findByToken(token_id: string): Promise<Token>;
}

export { ITokensRepository };
