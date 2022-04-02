import "reflect-metadata";
import "express-async-errors";

import express, { json } from "express";
import { pinoHttp } from "pino-http";

import "@shared/containers";
import "@shared/containers/providers";

import { errorHandler } from "@shared/infra/errors/errorHandler";

import { logger } from "./logger";
import { router } from "./routes";

const app = express();

app.use(json());
app.use(pinoHttp({ logger }));
app.use(router);
app.use(errorHandler);

export { app };
