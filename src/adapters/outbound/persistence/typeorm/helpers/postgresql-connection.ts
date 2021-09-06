import { Connection, createConnection, getConnection, getConnectionManager } from 'typeorm';
import DBConnection from '@adapters/outbound/persistence/helpers/interfaces/db-connection';

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
}
