import express, { json } from "express";
import { pinoHttp } from "pino-http";
import { errorHandler } from "src/middlewares/errorHandler";

import { logger } from "./logger";

class Server {
  private port: number;

  constructor(port: string) {
    this.port = parseInt(port, 10);
  }

  init(): void {
    const app = express();
    app.use(json());
    app.use(pinoHttp({ logger }));
    app.use(errorHandler);

    app.listen(this.port, () => {
      logger.info(`Server running on http://localhost:${this.port}`);
    });
  }
}

export { Server };
