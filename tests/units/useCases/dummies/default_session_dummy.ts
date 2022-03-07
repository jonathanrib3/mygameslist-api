import "../../../../config.js";

import { ResetSession } from "@modules/accounts/models/ResetSession";

import { user } from "./default_user_dummy";

const session = new ResetSession();

Object.assign(session, {
  user_id: user.id,
  created_at: new Date(),
  expires_in:
    new Date().getTime() + Number(process.env.SESSION_EXPIRATION_TIME),
});

export { session };
