import { v4 } from "uuid";

class ResetSession {
  id: string;

  user_id: string;

  created_at: Date;

  expires_in: number;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}

export { ResetSession };
