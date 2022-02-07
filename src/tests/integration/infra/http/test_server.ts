import "express-async-errors";

import { errorHandler } from "@infra/errors/errorHandler";
import { router } from "@infra/http/routes";
import "@shared/containers";
import "@shared/containers/providers";

import express, { json } from "express";

const testApp = express();

testApp.use(json());
testApp.use(router);
testApp.use(errorHandler);

export { testApp };
