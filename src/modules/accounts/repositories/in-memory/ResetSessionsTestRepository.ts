import { AppError } from "@infra/errors/AppError";
import { ResetSession } from "@modules/accounts/models/ResetSession";
import { EXISTENT_NON_EXPIRED_SESSION_ERROR } from "@shared/constants/error_messages";

import { ISessionsRepository } from "../ISessionsRepository";

class ResetSessionsTestRepository implements ISessionsRepository {
  private repository: ResetSession[];

  constructor() {
    this.repository = [];
  }

  async create(user_id: string): Promise<ResetSession> {
    const sessionAlreadyExists = await this.findByUserId(user_id);

    if (sessionAlreadyExists) {
      if (this.isSessionExpired(sessionAlreadyExists)) {
        await this.deleteById(sessionAlreadyExists.id);
      } else {
        throw new AppError(401, EXISTENT_NON_EXPIRED_SESSION_ERROR);
      }
    }

    const new_session = new ResetSession();

    Object.assign(new_session, {
      user_id,
      created_at: new Date(),
      expires_in:
        new Date().getTime() + Number(process.env.SESSION_EXPIRATION_TIME),
    });

    this.repository.push(new_session);

    return new_session;
  }

  async findByUserId(user_id: string): Promise<ResetSession> {
    return this.repository.find((session) => session.user_id === user_id);
  }

  isSessionExpired(session: ResetSession): boolean {
    return (
      new Date().getTime() - Number(process.env.SESSION_EXPIRATION_TIME) >
      session.expires_in
    );
  }

  async deleteById(session_id: string): Promise<void> {
    this.repository = this.repository.filter(
      (session) => session.id === session_id
    );
  }

  async findById(session_id: string): Promise<ResetSession> {
    return this.repository.find((session) => session.id === session_id);
  }

  /*
    -- METHOD FOR TEST-ONLY PURPOSES --
    
  Forces a session to be expired by making the expiring date to
   be 10 minutes late comparing to the actual date.
  */
  async setSessionToExpired(session_id: string): Promise<void> {
    const session_update = await this.findById(session_id);
    session_update.expires_in =
      session_update.created_at.getTime() -
      Number(process.env.SESSION_EXPIRATION_TIME);
  }
}

export { ResetSessionsTestRepository };
