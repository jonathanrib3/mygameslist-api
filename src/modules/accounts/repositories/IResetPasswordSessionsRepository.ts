import { ResetPasswordSession } from "../models/ResetPasswordSession";

interface IResetPasswordSessionsRepository {
  create(user_id: string, token_secret: string): Promise<ResetPasswordSession>;
  findByUserId(user_id: string): Promise<ResetPasswordSession>;
  findById(session_id: string): Promise<ResetPasswordSession>;
}

export { IResetPasswordSessionsRepository };
