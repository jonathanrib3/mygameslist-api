import { v4 } from "uuid";

import { connectMongo } from "@infra/database/mongodb/connect_to_mongo";
import { AppError } from "@infra/errors/AppError";
import { ResetSessionModel } from "@modules/accounts/models/mongodb/models/ResetSessionModel";
import { ResetSession } from "@modules/accounts/models/ResetSession";
import { ISessionsRepository } from "@modules/accounts/repositories/ISessionsRepository";
import { EXISTENT_NON_EXPIRED_SESSION_ERROR } from "@shared/constants/error_messages";

export class MongoResetSessionsRepository implements ISessionsRepository {
  private repository = ResetSessionModel;

  constructor() {
    connectMongo();
  }

  async create(user_id: string, token_secret: string): Promise<ResetSession> {
    const session_exists = await this.findByUserId(user_id);

    if (session_exists) {
      throw new AppError(400, EXISTENT_NON_EXPIRED_SESSION_ERROR);
    }

    const new_session = new ResetSessionModel({
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

  async findByUserId(user_id: string): Promise<ResetSession> {
    return this.repository.findOne({ user_id });
  }

  async findById(session_id: string): Promise<ResetSession> {
    return this.repository.findById(session_id);
  }
}
