import express, { json } from "express";
import { pinoHttp } from "pino-http";
import { AppError } from "src/errors/AppError";
import { errorHandler } from "src/middlewares/errorHandler";

import { logger } from "./logger";

class Server {
  private port: number;

  constructor(port: string) {
    this.port = parseInt(port, 10);
  }

  init() {
    const app = express();
    app.use(json());
    app.use(pinoHttp({ logger }));
    app.use(errorHandler);

    app.get("/", (request, response) =>
      response.status(200).send({ message: "Welcome!!" })
    );

    app.get("/error", (request, response) => {
      throw new AppError(400, "TESTe");
    });

    app.listen(this.port, () => {
      logger.info(`Server running on http://localhost:${this.port}`);
    });
  }
}

export { Server };
