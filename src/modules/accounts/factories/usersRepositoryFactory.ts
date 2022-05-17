import "@root/config.js";

import { container } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { INTERNAL_SERVER_ERROR } from "@shared/constants/error_messages";

const environment = process.env.NODE_ENV.trim();

let usersRepository: IUsersRepository;

export function getUsersRepository(): IUsersRepository {
  switch (environment) {
    case "test": {
      usersRepository = container.resolve<IUsersRepository>(
        "UsersTestRepository"
      );

      return usersRepository;
    }

    case "development": {
      usersRepository = container.resolve<IUsersRepository>(
        "MongoUsersRepository"
      );

      return usersRepository;
    }

    case "production": {
      usersRepository = container.resolve<IUsersRepository>(
        "MongoUsersRepository"
      );

      return usersRepository;
    }

    default: {
      throw new AppError(500, INTERNAL_SERVER_ERROR);
    }
  }
}
