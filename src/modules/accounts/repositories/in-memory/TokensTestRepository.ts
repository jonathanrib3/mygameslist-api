import bcrypt from "bcrypt";

import { Token } from "@modules/accounts/models/Token";
import { TOKEN_EXPIRATION_TIME } from "@shared/constants/numeric_constants";

import { ITokensRepository } from "../ITokensRepository";

class TokensTestRepository implements ITokensRepository {
  private repository: Token[];

  constructor() {
    this.repository = [];
  }

  create(token_id: string, user_id: string): void {
    const new_token = new Token();

    Object.assign(new_token, {
      user_id,
      id: token_id,
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

  async findByToken(hashed_token_id: string): Promise<Token> {
    return this.repository.find((token) =>
      bcrypt.compareSync(token.id, hashed_token_id)
    );
  }

  /*
    -- METHOD FOR TEST-ONLY PURPOSES --
    
  Forces a token to be expired by making the expiring date to
   be 30 minutes late comparing to the actual date.
  */
  async setTokenToExpired(hashed_token_id: string) {
    const token_update = await this.findByToken(hashed_token_id);
    token_update.expires_in =
      token_update.created_at.getTime() - TOKEN_EXPIRATION_TIME;
  }
}

export { TokensTestRepository };
