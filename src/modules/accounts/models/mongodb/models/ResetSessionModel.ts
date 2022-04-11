import { model } from "mongoose";

import { resetSessionSchema } from "@modules/accounts/models/mongodb/schemas/resetSessionSchema";
import { ResetSession } from "@modules/accounts/models/ResetSession";

export const ResetSessionModel = model<ResetSession>(
  "ResetSession",
  resetSessionSchema
);
