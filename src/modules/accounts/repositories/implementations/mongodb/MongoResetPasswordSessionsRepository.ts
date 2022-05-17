import { v4 } from "uuid";

import { connectMongo } from "@infra/database/mongodb/connect_to_mongo";
import { AppError } from "@infra/errors/AppError";
import { ResetPasswordSessionModel } from "@modules/accounts/models/mongodb/models/ResetPasswordSessionModel";
import { ResetPasswordSession } from "@modules/accounts/models/ResetPasswordSession";
import { IResetPasswordSessionsRepository } from "@modules/accounts/repositories/IResetPasswordSessionsRepository";
import { EXISTENT_NON_EXPIRED_SESSION_ERROR } from "@shared/constants/error_messages";

export class MongoResetPasswordSessionsRepository
  implements IResetPasswordSessionsRepository
{
  private repository = ResetPasswordSessionModel;

  constructor() {
    connectMongo();
  }

  async create(
    user_id: string,
    token_secret: string
  ): Promise<ResetPasswordSession> {
    const session_exists = await this.findByUserId(user_id);

    if (session_exists) {
      throw new AppError(400, EXISTENT_NON_EXPIRED_SESSION_ERROR);
    }

    const new_session = new ResetPasswordSessionModel({
      _id: v4(),
      user_id,
      token: {
        _id: v4(),
        user_id,
        token_secret,
        created_at: new Date(),
      },
      created_at: new Date(),
    });

    await new_session.save();

    return new_session;
  }

  async findByUserId(user_id: string): Promise<ResetPasswordSession> {
    return this.repository.findOne({ user_id });
  }

  async findById(session_id: string): Promise<ResetPasswordSession> {
    return this.repository.findById(session_id);
  }
}
