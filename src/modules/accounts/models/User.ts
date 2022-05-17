import { v4 as uuidV4 } from "uuid";

import { IGamesList } from "@modules/games/interfaces/IGamesList";

class User {
  id: string;

  username: string;

  email: string;

  password: string;

  avatar: string;

  gamesList: IGamesList;

  admin: boolean;

  created_at: Date;

  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
      this.gamesList = {
        id: uuidV4(),
        list: [],
      };
    }
    this.admin = false;
  }
}

export { User };
