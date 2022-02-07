"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({
    level: "debug",
    transport: {
        targets: [
            {
                target: "pino-pretty",
                level: "debug",
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                },
            },
            {
                target: "pino-pretty",
                level: "warn",
                options: {
                    colorize: false,
                    destination: "./logs/error.log",
                    mkdir: true,
                    translateTime: "SYS:standard",
                },
            },
        ],
    },
});
exports.logger = logger;
