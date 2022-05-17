import "@root/config.js";

import { container } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { IResetPasswordSessionsRepository } from "@modules/accounts/repositories/IResetPasswordSessionsRepository";
import { INTERNAL_SERVER_ERROR } from "@shared/constants/error_messages";

const environment = process.env.NODE_ENV.trim();

let resetPasswordSessionsRepository: IResetPasswordSessionsRepository;

export function getResetPasswordSessionsRepository(): IResetPasswordSessionsRepository {
  switch (environment) {
    case "test": {
      resetPasswordSessionsRepository =
        container.resolve<IResetPasswordSessionsRepository>(
          "ResetPasswordSessionsTestRepository"
        );

      return resetPasswordSessionsRepository;
    }

    case "development": {
      resetPasswordSessionsRepository =
        container.resolve<IResetPasswordSessionsRepository>(
          "MongoResetPasswordSessionsRepository"
        );

      return resetPasswordSessionsRepository;
    }

    case "production": {
      resetPasswordSessionsRepository =
        container.resolve<IResetPasswordSessionsRepository>(
          "MongoResetPasswordSessionsRepository"
        );

      return resetPasswordSessionsRepository;
    }

    default: {
      throw new AppError(500, INTERNAL_SERVER_ERROR);
    }
  }
}
