import express, { json } from "express";
import pinoHttp from "pino-http";

import { logger } from "./infra/logger";

const app = express();

app.use(json());
app.use(pinoHttp({ logger }));

app.get("/", (request, response) =>
  response.status(200).send({ message: "Welcome!!" })
);

app.get("/error", (request, response) => {
  throw new Error("sei lakkk");
});

app.listen(3000, () => {
  logger.info("Server running on http://localhost/3000");
});
