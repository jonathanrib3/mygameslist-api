import "reflect-metadata";
import "express-async-errors";

import express, { json } from "express";
import { pinoHttp } from "pino-http";

import "@shared/containers";
import "@shared/containers/providers";

import { MongoConnection } from "@infra/database/mongodb/MongoConnection";
import { client } from "@infra/database/redis/redis_client";
import { errorHandler } from "@shared/infra/errors/errorHandler";

import { logger } from "./logger";
import { router } from "./routes";

async function httpInit() {
  const mongo_connection = new MongoConnection();
  mongo_connection.create();
  await client.connect();
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
