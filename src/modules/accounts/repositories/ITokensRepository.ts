import { Token } from "../models/Token";

interface ITokensRepository {
  create(token: string, user_id: string): void;
  findByUserId(user_id: string): Promise<Token>;
}

export { ITokensRepository };
