import { v4 } from "uuid";

class Session {
  id: string;

  user_id: string;

  expires_in: number;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}

export { Session };
