import "@root/config.js";

import { container } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { IResetPasswordSessionsRepository } from "@modules/accounts/repositories/IResetPasswordSessionsRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { CreateResetPasswordSessionUseCase } from "@modules/accounts/useCases/create_reset_password_session/CreateResetPasswordSessionUseCase";
import { INTERNAL_SERVER_ERROR } from "@shared/constants/error_messages";
import { IMailProvider } from "@shared/containers/providers/IMailProvider";

const environment = process.env.NODE_ENV.trim();
const usersRepository = container.resolve<IUsersRepository>(
  "MongoUsersRepository"
);
const sessionsRepository = container.resolve<IResetPasswordSessionsRepository>(
  "MongoResetPasswordSessionsRepository"
);

let mailProvider: IMailProvider;

export function getCreateResetPasswordSessionUseCase(): CreateResetPasswordSessionUseCase {
  switch (environment) {
    case "test": {
      mailProvider = container.resolve<IMailProvider>("NodemailerMailProvider");
      return new CreateResetPasswordSessionUseCase(
        usersRepository,
        sessionsRepository,
        mailProvider
      );
    }

    case "development": {
      mailProvider = container.resolve<IMailProvider>("SESMailProvider");

      return new CreateResetPasswordSessionUseCase(
        usersRepository,
        sessionsRepository,
        mailProvider
      );
    }

    case "production": {
      mailProvider = container.resolve<IMailProvider>("SESMailProvider");

      return new CreateResetPasswordSessionUseCase(
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
