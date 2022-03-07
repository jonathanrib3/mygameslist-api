import { v4 } from "uuid";

import { ResetToken } from "@modules/accounts/models/ResetToken";

import { user } from "./default_user_dummy";

const reset_token = new ResetToken();

Object.assign(reset_token, {
  id: v4(),
  user_id: user.id,
  created_at: new Date(),
  expires_in: new Date().getTime() + 300000,
});

export { reset_token };
