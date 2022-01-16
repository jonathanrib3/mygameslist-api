import pino from "pino";

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

export { logger };
