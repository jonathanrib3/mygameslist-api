import "../../../../../config.js";

import bcrypt from "bcrypt";

import { ResetToken } from "@modules/accounts/models/ResetToken";

import { ITokensRepository } from "../ITokensRepository";

class TokensTestRepository implements ITokensRepository {
  private repository: ResetToken[];

  constructor() {
    this.repository = [];
  }

  async create(token_id: string, user_id: string): Promise<IResetTokenInfo> {
    const new_token = new ResetToken();

    Object.assign(new_token, {
      user_id,
      id: token_id,
      created_at: new Date(),
      expires_in:
        new Date().getTime() + Number(process.env.TOKEN_EXPIRATION_TIME),
    });

    if (this.findByUserId(user_id)) {
      this.deleteByUserId(user_id);
    }

    this.repository.push(new_token);

    const token_info: IResetTokenInfo = {
      token_id: new_token.id,
      user_id,
    };

    return token_info;
  }

  async findByUserId(user_id: string): Promise<ResetToken> {
    return this.repository.find((token) => token.user_id === user_id);
  }

  async deleteByUserId(user_id: string): Promise<void> {
    const new_array_with_deleted_token = this.repository.filter(
      (token) => token.user_id !== user_id
    );

    this.repository = new_array_with_deleted_token;
  }

  async findByToken(hashed_token_id: string): Promise<ResetToken> {
    return this.repository.find((token) =>
      bcrypt.compareSync(token.id, hashed_token_id)
    );
  }

  /*
    -- METHOD FOR TEST-ONLY PURPOSES --
    
  Forces a token to be expired by making the expiring date to
   be 10 minutes late comparing to the actual date.
  */
  async setTokenToExpired(hashed_token_id: string) {
    const token_update = await this.findByToken(hashed_token_id);
    token_update.expires_in =
      token_update.created_at.getTime() -
      Number(process.env.TOKEN_EXPIRATION_TIME);
  }
}

export { TokensTestRepository };
