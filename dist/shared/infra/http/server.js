"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
require("reflect-metadata");
require("express-async-errors");
const express_1 = __importStar(require("express"));
const pino_http_1 = require("pino-http");
const errorHandler_1 = require("@shared/infra/errors/errorHandler");
require("@shared/containers");
require("@shared/containers/providers");
const logger_1 = require("./logger");
const routes_1 = require("./routes");
function init() {
    const PORT = process.env.SERVER_PORT;
    const app = (0, express_1.default)();
    app.use((0, express_1.json)());
    app.use((0, pino_http_1.pinoHttp)({ logger: logger_1.logger }));
    app.use(routes_1.router);
    app.use(errorHandler_1.errorHandler);
    app.listen(PORT, () => {
        logger_1.logger.info(`Server running on http://localhost:${PORT}`);
    });
}
exports.init = init;
