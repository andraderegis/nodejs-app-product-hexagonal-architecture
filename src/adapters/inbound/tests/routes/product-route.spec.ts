import request from 'supertest';
import { v4 as uuid } from 'uuid';

import { ProductError } from '@application/domain/errors/product-error';
import Product from '@application/domain/product';
import { ProductEntity } from '@adapters/outbound/persistence/typeorm/entities';
import { ServerError } from '@adapters/inbound/errors/http';
import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';
import MockPostgresqlDB from '@adapters/outbound/persistence/typeorm/mocks/mock-postgresql-db';

describe('Product Routes', () => {
  let sysUnderTest: any;
  let connection: DBConnection;

  const createProductSpy = jest.fn();
  const getProductSpy = jest.fn();
  const updateProductSpy = jest.fn();

  beforeAll(done => {
    (async () => {
      const { app } = await import('@adapters/config/express');

      sysUnderTest = app;

      connection = DBConnection.getInstance();

      await MockPostgresqlDB.make([ProductEntity]);

      setTimeout(done, 100);
    })();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  describe('POST - /products', () => {
    jest.mock('@application/services/product-service', () => ({
      ProductService: jest.fn().mockReturnValue({
        create: createProductSpy,
        get: getProductSpy,
        update: updateProductSpy
      })
    }));

    it('should create and return status code 201', async () => {
      const productToSave = { name: 'notebook', price: 10000 };

      createProductSpy.mockResolvedValueOnce(productToSave);

      const { status, body } = await request(sysUnderTest)
        .post('/api/v1/products')
        .send(productToSave);

      expect(status).toEqual(201);
      expect(body).toEqual(expect.objectContaining(productToSave));
    });

    it('should not create and return status code 400. invalid price', async () => {
      const productToSave = { name: 'Notebook Acer Nitro 5', price: -5000 };

      createProductSpy.mockImplementationOnce(() => {
        throw new ProductError('The price must be greater or equal zero.');
      });

      const {
        status,
        body: { error }
      } = await request(sysUnderTest).post('/api/v1/products').send(productToSave);

      expect(status).toEqual(400);
      expect(error).toBeDefined();
      expect(error).toEqual('The price must be greater or equal zero.');
    });

    it('should not create and return status code 500', async () => {
      createProductSpy.mockImplementationOnce(() => {
        throw new ServerError(new Error('Server Error'));
      });

      const {
        status,
        body: { error }
      } = await request(sysUnderTest).post('/api/v1/products').send({});

      expect(status).toEqual(500);
      expect(error).toBeDefined();
    });
  });

  describe('GET - /products/:id', () => {
    it('should get product', async () => {
      const product = {
        id: uuid(),
        name: 'notebook',
        price: 5000
      };

      getProductSpy.mockResolvedValueOnce(product);

      const { status, body } = await request(sysUnderTest).get(`/api/v1/products/${product.id}`);

      expect(status).toBe(200);
      expect(product).toEqual(expect.objectContaining(body));
    });

    it('should not found product', async () => {
      const product = {
        id: uuid
      };

      getProductSpy.mockResolvedValueOnce(undefined);

      const { status, body } = await request(sysUnderTest).get(`/api/v1/products/${product.id}`);

      expect(status).toBe(404);
      expect(body).toEqual({});
    });
  });

  describe('PATCH - /products', () => {
    beforeAll(() => {
      jest.resetAllMocks();
    });
    it('should update product', async () => {
      const product = new Product('Legion 5i', 7000);

      updateProductSpy.mockResolvedValueOnce(product);

      const { status, body } = await request(sysUnderTest).patch('/api/v1/products').send(product);

      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(body).toEqual(expect.objectContaining({ ...product }));
    });

    it('should not update product. not found product', async () => {
      const product = new Product('Legion 5i', 7000);

      updateProductSpy.mockImplementationOnce(() => {
        throw new ProductError(`product ${product.id} not found`);
      });

      const { status, error } = await request(sysUnderTest).patch('/api/v1/products').send(product);

      expect(status).toBe(400);
      expect(error).toBeDefined();
    });

    it('should not update product. server error', async () => {
      updateProductSpy.mockImplementationOnce(() => {
        throw new ServerError();
      });

      const { status, error } = await request(sysUnderTest).patch('/api/v1/products').send({});

      expect(status).toBe(500);
      expect(error).toBeDefined();
    });
  });
});
