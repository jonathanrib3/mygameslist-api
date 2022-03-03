import { ResetSession } from "../models/ResetSession";

interface ISessionsRepository {
  create(user_id: string): Promise<string>;
  findByUserId(user_id: string): Promise<ResetSession>;
}

export { ISessionsRepository };
