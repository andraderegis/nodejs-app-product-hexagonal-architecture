import { Connection, createConnection, getConnection, getConnectionManager } from 'typeorm';
import DBConnection from '@adapters/outbound/persistence/helpers/interfaces/db-connection';
import ConnectionNotFoundError from '@adapters/outbound/persistence/helpers/connection-errors';

export default class PostgreSQLConnection implements DBConnection {
  private static instance?: PostgreSQLConnection;

  private connection?: Connection;

  private constructor() {}

  static getInstance(): PostgreSQLConnection {
    if (!this.instance) {
      this.instance = new PostgreSQLConnection();
    }

    return this.instance;
  }

  async connect(): Promise<void> {
    this.connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection();
  }

  async disconnect(): Promise<void> {
    if (!this.connection) {
      throw new ConnectionNotFoundError();
    }

    await getConnection().close();

    this.connection = undefined;
  }
}
