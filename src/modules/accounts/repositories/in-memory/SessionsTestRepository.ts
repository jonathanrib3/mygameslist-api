import { Session } from "@modules/accounts/models/Session";
import { SESSION_CREATED_SUCCESSFULLY } from "@shared/constants/successful_messages";

import { ISessionsRepository } from "../ISessionsRepository";

class SessionsTestRepository implements ISessionsRepository {
  private repository: Session[];

  constructor() {
    this.repository = [];
  }

  async create(user_id: string) {
    const new_session = new Session();

    Object.assign(new_session, {
      user_id,
      expires_in: new Date().getTime() + process.env.SESSION_EXPIRATION_TIME,
    });

    return SESSION_CREATED_SUCCESSFULLY;
  }
}

export { SessionsTestRepository };
