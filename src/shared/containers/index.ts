import { container } from "tsyringe";

import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersTestRepository",
  UsersTestRepository
);
