import "../../../../../config.js";

import mongoose from "mongoose";

interface IMongoConnection {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

class MongoConnection {
  private connectionString: string;

  private connectionOptions: IMongoConnection;

  async create(): Promise<void> {
    this.setConnectionOptions();

    const { host, port, username, password, database } = this.connectionOptions;

    this.connectionString = `mongodb://${username}:${password}@${host}:${port}`;

    await mongoose.connect(this.connectionString, { dbName: database });
  }

  status() {
    const { connection } = mongoose;

    return connection;
  }

  setConnectionOptions(): void {
    this.connectionOptions = {
      host: process.env.MONGODB_HOST,
      port: process.env.MONGODB_PORT,
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
      database: process.env.MONGODB_NAME,
    };
  }
}

export { MongoConnection };
