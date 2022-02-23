import "../../../../config.js";

import mongoose from "mongoose";

interface IConnection {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

class Connection {
  private connectionString: string;

  private connectionOptions: IConnection;

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
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
  }
}

export { Connection };
