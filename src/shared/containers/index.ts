import { container } from "tsyringe";

import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { MongoResetSessionsRepository } from "@modules/accounts/repositories/implementations/mongodb/MongoResetSessionsRepository";
import { MongoUsersRepository } from "@modules/accounts/repositories/implementations/mongodb/MongoUsersRepository";
import { ISessionsRepository } from "@modules/accounts/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersTestRepository",
  UsersTestRepository
);

container.registerSingleton<IUsersRepository>(
  "MongoUsersRepository",
  MongoUsersRepository
);

container.registerSingleton<ISessionsRepository>(
  "MongoResetSessionsRepository",
  MongoResetSessionsRepository
);
