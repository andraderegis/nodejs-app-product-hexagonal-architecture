import { IMemoryDb, newDb } from 'pg-mem';
import { Connection } from 'typeorm';

import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';

class MockPostgresqlDB {
  private constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async make(entities?: any[]): Promise<IMemoryDb> {
    const db = newDb();

    db.public.registerFunction({
      name: 'current_database',
      implementation: x => x
    });

    const connection: Connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      name: 'default',
      entities: entities ?? ['src/adapters/outbound/typeorm/entities/index.ts'],
      database: 'mock_database'
    });

    await connection.synchronize();

    await DBConnection.getInstance().connect();

    return db;
  }
}

export default MockPostgresqlDB;
