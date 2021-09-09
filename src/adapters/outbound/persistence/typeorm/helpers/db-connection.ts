import { Connection, createConnection, getConnection, getConnectionManager } from 'typeorm';
import IDBConnection from '@adapters/outbound/persistence/helpers/interfaces/db-connection';
import ConnectionNotFoundError from '@adapters/outbound/persistence/helpers/connection-errors';

export default class DBConnection implements IDBConnection {
  private static instance?: DBConnection;

  private connection?: Connection;

  private constructor() {}

  static getInstance(): DBConnection {
    if (!this.instance) {
      this.instance = new DBConnection();
    }

    return this.instance;
  }

  async connect(name?: string): Promise<void> {
    this.connection = getConnectionManager().has(name || 'default')
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
