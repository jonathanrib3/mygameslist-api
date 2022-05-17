import { model } from "mongoose";

import { resetPasswordSessionSchema } from "@modules/accounts/models/mongodb/schemas/resetPasswordSessionSchema";
import { ResetPasswordSession } from "@modules/accounts/models/ResetPasswordSession";

export const ResetPasswordSessionModel = model<ResetPasswordSession>(
  "ResetPasswordSession",
  resetPasswordSessionSchema
);
