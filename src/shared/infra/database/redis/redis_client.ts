import "../../../../../config.js";

import { createClient } from "redis";
import { logger } from "@infra/http/logger";

interface IConnectionOptions {
  username: string;
  password: string;
  host: string;
  port: number;
  database: number;
}

const connection_options: IConnectionOptions = {
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  database: Number(process.env.REDIS_DATABASE),
};

const { username, password, host, port, database } = connection_options;

const client = createClient({
  url: `redis://${username}:${password}@${host}:${port}/${database}`,
});

client.on("error", (err) => logger.error(err));

export { client };
