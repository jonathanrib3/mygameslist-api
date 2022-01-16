import "dotenv/config";
import { Server } from "@infra/Server";

const server = new Server(process.env.SERVER_PORT);

server.init();
