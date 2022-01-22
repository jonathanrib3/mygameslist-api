import { v4 as uuidV4 } from "uuid";

import { IGamesList } from "../interfaces";

class User {
  id: string;

  username: string;

  email: string;

  password: string;

  avatar: string;

  gamesList: IGamesList;

  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
      this.gamesList = {
        id: uuidV4(),
        list: [],
      };
    }
  }
}

export { User };
