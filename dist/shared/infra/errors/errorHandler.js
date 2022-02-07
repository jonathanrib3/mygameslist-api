"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("@shared/infra/errors/AppError");
function errorHandler(error, request, response, _next) {
    if (error instanceof AppError_1.AppError) {
        return response.status(error.status).send({ message: error.message });
    }
    console.log(error);
    return response.status(500).send({ message: "Server internal error" });
}
exports.errorHandler = errorHandler;
