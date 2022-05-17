import { container } from "tsyringe";

import { ResetPasswordSessionsTestRepository } from "@modules/accounts/repositories/implementations/in-memory/ResetSessionsTestRepository";
import { UsersTestRepository } from "@modules/accounts/repositories/implementations/in-memory/UsersTestRepository";
import { MongoResetPasswordSessionsRepository } from "@modules/accounts/repositories/implementations/mongodb/MongoResetPasswordSessionsRepository";
import { MongoUsersRepository } from "@modules/accounts/repositories/implementations/mongodb/MongoUsersRepository";
import { IResetPasswordSessionsRepository } from "@modules/accounts/repositories/IResetPasswordSessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersTestRepository",
  UsersTestRepository
);

container.registerSingleton<IResetPasswordSessionsRepository>(
  "ResetPasswordSessionsTestRepository",
  ResetPasswordSessionsTestRepository
);

container.registerSingleton<IUsersRepository>(
  "MongoUsersRepository",
  MongoUsersRepository
);

container.registerSingleton<IResetPasswordSessionsRepository>(
  "MongoResetPasswordSessionsRepository",
  MongoResetPasswordSessionsRepository
);
