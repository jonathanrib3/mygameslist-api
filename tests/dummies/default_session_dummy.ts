import "@root/config.js";

import { ResetSession } from "@modules/accounts/models/ResetSession";

import { reset_token } from "./default_reset_token_dummy";
import { user } from "./default_user_dummy";

const session = new ResetSession();

Object.assign(session, {
  user_id: user.id,
  created_at: new Date(),
  token: reset_token,
  expires_in:
    new Date().getTime() + Number(process.env.SESSION_EXPIRATION_TIME),
});

export { session };
