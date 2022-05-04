import "@root/config.js";

import { container } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { ISessionsRepository } from "@modules/accounts/repositories/ISessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { CreateResetSessionUseCase } from "@modules/accounts/useCases/create_reset_session/CreateResetSessionUseCase";
import { INTERNAL_SERVER_ERROR } from "@shared/constants/error_messages";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";

const environment = process.env.NODE_ENV.trim();
const usersRepository = container.resolve<IUsersRepository>(
  "MongoUsersRepository"
);
const sessionsRepository = container.resolve<ISessionsRepository>(
  "MongoResetSessionsRepository"
);

export function getCreateResetSessionUseCase(): CreateResetSessionUseCase {
  switch (environment) {
    case "test": {
      const mailProvider = container.resolve<IMailProvider>(
        "NodemailerMailProvider"
      );
      return new CreateResetSessionUseCase(
        usersRepository,
        sessionsRepository,
        mailProvider
      );
    }

    case "development": {
      const mailProvider = container.resolve<IMailProvider>("SESMailProvider");

      return new CreateResetSessionUseCase(
        usersRepository,
        sessionsRepository,
        mailProvider
      );
    }

    case "production": {
      const mailProvider = container.resolve<IMailProvider>("SESMailProvider");

      return new CreateResetSessionUseCase(
        usersRepository,
        sessionsRepository,
        mailProvider
      );
    }

    default: {
      throw new AppError(500, INTERNAL_SERVER_ERROR);
    }
  }
}
