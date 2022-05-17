import "@root/config.js";

import { ResetPasswordSession } from "@modules/accounts/models/ResetPasswordSession";

import { reset_token } from "./default_reset_token_dummy";
import { user } from "./default_user_dummy";

const session = new ResetPasswordSession();

Object.assign(session, {
  user_id: user.id,
  created_at: new Date(),
  token: reset_token,
  expires_in:
    new Date().getTime() + Number(process.env.SESSION_EXPIRATION_TIME),
});

export { session };
