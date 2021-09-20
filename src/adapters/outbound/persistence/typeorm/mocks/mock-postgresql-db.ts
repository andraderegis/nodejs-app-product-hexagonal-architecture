/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMemoryDb, newDb } from 'pg-mem';
import { Connection } from 'typeorm';
import * as entityModules from '@adapters/outbound/persistence/typeorm/entities';

import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';

class MockPostgresqlDB {
  private constructor() {}

  static async make(entities?: any[]): Promise<IMemoryDb> {
    const db = newDb();

    db.public.registerFunction({
      name: 'current_database',
      implementation: x => x
    });

    const connection: Connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      name: 'default',
      entities: entities || (await this.parseImportedEntities()),
      database: 'mock_database'
    });

    await connection.synchronize();

    await DBConnection.getInstance().connect();

    return db;
  }

  private static parseImportedEntities(): Promise<any[]> {
    try {
      return Promise.resolve(
        Object.entries(entityModules).map(item => {
          const [, value] = item;
          return value;
        }) as any[]
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default MockPostgresqlDB;
