import { debug } from "console";
import { NextFunction, Request, Response } from "express";
import path from "path";
import pino from "pino";

// const dest = ;

const logger = pino({
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

console.log(path.resolve(__dirname, "../../logs"));

// const errorLogger = pino(
//   {
//     name: "error",
//     level: "error",
//     transport: {
//       target: "pino-pretty",
//       options: {
//         colorize: true,
//         translateTime: "SYS:standard",
//       },
//     },
//   }
// );

export { logger };
