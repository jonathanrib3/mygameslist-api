import "reflect-metadata";
import "express-async-errors";

import express, { json } from "express";
import { pinoHttp } from "pino-http";

import { errorHandler } from "@shared/infra/errors/errorHandler";
import "@shared/containers";
import "@shared/containers/providers";

import { Connection } from "@infra/database/Connection";

import { logger } from "./logger";
import { router } from "./routes";

function httpInit() {
  const connection = new Connection();
  connection.create();
  const PORT = process.env.SERVER_PORT;
  const app = express();

  app.use(json());
  app.use(pinoHttp({ logger }));
  app.use(router);
  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

export { httpInit };
