import request from 'supertest';
import { IBackup } from 'pg-mem';

import { ProductError } from '@application/domain/errors/product-error';
import { ProductEntity } from '@adapters/outbound/persistence/typeorm/entities';
import { ServerError } from '@adapters/inbound/errors/http';
import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';
import MockPostgresqlDB from '@adapters/outbound/persistence/typeorm/mocks/mock-postgresql-db';
// import { Repository } from 'typeorm';

describe('Product Routes', () => {
  let expressApp: any;
  let connection: DBConnection;
  let dbBackup: IBackup;
  // let repository: Repository<ProductEntity>;

  const createProductSpy = jest.fn();

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
  describe('POST - /products', () => {
    jest.mock('@application/services/product-service', () => ({
      ProductService: jest.fn().mockReturnValue({
        create: createProductSpy
      })
    }));

    it('should create and return status code 201', async () => {
      const productToSave = { name: 'notebook', price: 10000 };

      createProductSpy.mockResolvedValueOnce(productToSave);

      const { status, body } = await request(expressApp)
        .post('/api/v1/products')
        .send(productToSave);

      expect(status).toEqual(201);
      expect(body).toEqual(expect.objectContaining(productToSave));
    });

    it('should not create and return status code 400. invalid price', async () => {
      const productToSave = { name: 'notebook', price: -5000 };

      createProductSpy.mockImplementationOnce(() => {
        throw new ProductError('The price must be greater or equal zero.');
      });

      const { status, body } = await request(expressApp)
        .post('/api/v1/products')
        .send(productToSave);

      expect(status).toEqual(400);
      expect(body.error).toBeDefined();
      expect(body.error).toEqual('The price must be greater or equal zero.');
    });

    it('should not create and return status code 400. mandatory fields not informed', async () => {
      const productToSave = {};

      createProductSpy.mockImplementationOnce(() => {
        throw new ProductError('The price must be greater or equal zero.');
      });

      const {
        status,
        body: { error }
      } = await request(expressApp).post('/api/v1/products').send(productToSave);

      expect(status).toEqual(400);
      expect(error).toBeDefined();
    });

    it('should not create and return status code 500', async () => {
      const productToSave = { name: 'notebook', price: 5000 };

      createProductSpy.mockImplementationOnce(() => {
        throw new ServerError(new Error('Server Error'));
      });

      const {
        status,
        body: { error }
      } = await request(expressApp).post('/api/v1/products').send(productToSave);

      expect(status).toEqual(500);
      expect(error).toBeDefined();
    });

    // it('should get product', async () => {
    //   const productToSave = { name: 'notebook', price: 5000 };

    //   const product = await repository.save(productToSave);

    //   const {
    //     status,
    //     body
    //   } = await request(app).get('/api/v1/products').
    // });
  });
});
