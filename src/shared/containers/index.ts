import { container } from "tsyringe";

import { UsersTestRepository } from "@modules/accounts/repositories/in-memory/UsersTestRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { MongoUsersRepository } from "@modules/accounts/repositories/mongodb/MongoUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersTestRepository",
  UsersTestRepository
);

container.registerSingleton<IUsersRepository>(
  "MongoUsersRepository",
  MongoUsersRepository
);
