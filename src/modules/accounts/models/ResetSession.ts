import { v4 } from "uuid";

import { ResetToken } from "@modules/accounts/models/ResetToken";

class ResetSession {
  id: string;

  user_id: string;

  token: ResetToken;

  created_at: Date;

  expires_in?: number;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}

export { ResetSession };
