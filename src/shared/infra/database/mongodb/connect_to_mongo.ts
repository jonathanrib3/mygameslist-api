import "@root/config.js";

import { connect } from "mongoose";

interface IMongoConnection {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

const connectionOptions: IMongoConnection = {
  host: process.env.MONGODB_HOST,
  port: process.env.MONGODB_PORT,
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  database: process.env.MONGODB_NAME,
};

export async function connectMongo() {
  const { host, port, username, password, database } = connectionOptions;

  const connectionString = `mongodb://${username}:${password}@${host}:${port}`;

  await connect(connectionString, { dbName: database });
}
