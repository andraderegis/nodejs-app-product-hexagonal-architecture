import request from 'supertest';
import { IBackup } from 'pg-mem';

import { ProductEntity } from '@adapters/outbound/persistence/typeorm/entities';
import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';
import MockPostgresqlDB from '@adapters/outbound/persistence/typeorm/mocks/mock-postgresql-db';

describe('Product Routes', () => {
  describe('POST - /products', () => {
    let expressApp: any;
    let connection: DBConnection;
    let dbBackup: IBackup;
    // let repository: Repository<ProductEntity>;

    beforeAll(done => {
      (async () => {
        connection = DBConnection.getInstance();

        const db = await MockPostgresqlDB.make([ProductEntity]);

        dbBackup = db.backup();
        // repository = connection.getRepository(ProductEntity);

        const { app } = await import('@adapters/config/express');

        expressApp = app;

        setTimeout(done, 100);
      })();
    });

    afterAll(async () => {
      await connection.disconnect();
    });

    beforeEach(() => {
      dbBackup.restore();
    });

    it('should create and return status code 201', async () => {
      const productToSave = { name: 'notebook', price: 5000 };

      const { status, body } = await request(expressApp)
        .post('/api/v1/products')
        .send(productToSave);

      expect(status).toEqual(201);
      expect(body).toEqual(expect.objectContaining(productToSave));
    });
  });
});
