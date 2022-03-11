import "express-async-errors";

import express, { json } from "express";

import { errorHandler } from "@infra/errors/errorHandler";
import { router } from "@infra/http/routes";

const testApp = express();

testApp.use(json());
testApp.use(router);
testApp.use(errorHandler);

export { testApp };
