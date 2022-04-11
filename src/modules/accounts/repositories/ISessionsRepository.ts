import { ResetSession } from "../models/ResetSession";

interface ISessionsRepository {
  create(user_id: string, token_secret: string): Promise<ResetSession>;
  findByUserId(user_id: string): Promise<ResetSession>;
}

export { ISessionsRepository };
