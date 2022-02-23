import { Token } from "@modules/accounts/models/Token";
import { TOKEN_EXPIRATION_TIME } from "@shared/constants/numeric_constants";

import { ITokensRepository } from "../ITokensRepository";

class TokensTestRepository implements ITokensRepository {
  private repository: Token[];

  constructor() {
    this.repository = [];
  }

  create(token: string, user_id: string): void {
    const new_token = new Token();

    Object.assign(new_token, {
      user_id,
      token,
      created_at: new Date(),
      expires_in: new Date().getTime() + TOKEN_EXPIRATION_TIME,
    });

    if (this.findByUserId(user_id)) {
      this.deleteByUserId(user_id);
    }

    this.repository.push(new_token);
  }

  async findByUserId(user_id: string): Promise<Token> {
    return this.repository.find((token) => token.user_id === user_id);
  }

  async deleteByUserId(user_id: string): Promise<void> {
    const new_array_with_deleted_token = this.repository.filter(
      (token) => token.user_id !== user_id
    );

    this.repository = new_array_with_deleted_token;
  }
}

export { TokensTestRepository };
