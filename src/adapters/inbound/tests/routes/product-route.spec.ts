import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { ServerError } from '@adapters/inbound/errors/http';
import { ProductError } from '@application/domain/errors/product-error';
import { ProductStatus } from '@application/domain/product';

describe('Product Routes', () => {
  let sysUnderTest: any;

  const createProductControllerSpy = jest.fn();
  const getProductControllerSpy = jest.fn();
  const updateProductControllerSpy = jest.fn();
  const setProductControllerSpy = jest.fn();

  jest.mock('@adapters/inbound/controllers', () => ({
    CreateProductController: jest.fn().mockReturnValue({
      execute: createProductControllerSpy
    }),
    GetProductController: jest.fn().mockReturnValue({
      execute: getProductControllerSpy
    }),
    SetProductStatusController: jest.fn().mockReturnValue({
      execute: setProductControllerSpy
    }),
    UpdateProductController: jest.fn().mockReturnValue({
      execute: updateProductControllerSpy
    })
  }));

  beforeAll(done => {
    (async () => {
      const { app } = await import('@adapters/config/express');

      sysUnderTest = app;

      setTimeout(done, 100);
    })();
  });

  describe('POST - /products', () => {
    it('should create and return status code 201', async () => {
      const product = { name: 'notebook', price: 10000 };

      const response = {
        statusCode: 201,
        data: product
      };

      createProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body } = await request(sysUnderTest).post('/api/v1/products').send(product);

      expect(status).toEqual(response.statusCode);
      expect(body).toEqual(expect.objectContaining(response.data));
    });

    it('should not create and return status code 400. product error', async () => {
      const product = { name: 'notebook', price: -1000 };

      const response = {
        statusCode: 404,
        data: {}
      };

      createProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body } = await request(sysUnderTest).post('/api/v1/products').send(product);

      expect(status).toEqual(response.statusCode);
      expect(body).toEqual({});
    });

    it('should not create and return status code 500', async () => {
      const product = { name: 'notebook', price: 1000 };

      const response = {
        statusCode: 500,
        data: {},
        error: new ServerError()
      };

      createProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body } = await request(sysUnderTest).post('/api/v1/products').send(product);

      expect(status).toEqual(response.statusCode);
      expect(body.error).toEqual(new ServerError().message);
    });
  });

  describe('GET - /products/:id', () => {
    it('should get product', async () => {
      const product = {
        id: uuid(),
        name: 'notebook',
        price: 5000
      };

      const response = {
        statusCode: 200,
        data: product
      };

      getProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body } = await request(sysUnderTest).get(`/api/v1/products/${product.id}`);

      expect(status).toBe(response.statusCode);
      expect(product).toEqual(expect.objectContaining(body));
    });

    it('should not found product', async () => {
      const response = {
        statusCode: 404,
        data: {}
      };

      getProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body } = await request(sysUnderTest).get(`/api/v1/products/${uuid()}`);

      expect(status).toBe(response.statusCode);
      expect(body).toEqual({});
    });
  });

  describe('PATCH - /products', () => {
    it('should update product', async () => {
      const product = { id: uuid(), name: 'Legion 5i', price: 7000 };

      const response = {
        statusCode: 200,
        data: product
      };

      updateProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body } = await request(sysUnderTest).patch('/api/v1/products').send(product);

      expect(status).toBe(response.statusCode);
      expect(body).toEqual(expect.objectContaining(product));
    });

    it('should not update product. not found product', async () => {
      const product = { id: uuid(), name: 'Legion 5i' };

      const response = {
        statusCode: 400,
        data: {},
        error: new ProductError()
      };

      updateProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body, error } = await request(sysUnderTest)
        .patch('/api/v1/products')
        .send(product);

      expect(status).toBe(response.statusCode);
      expect(body.error).toEqual(new ProductError().message);
      expect(error).toBeDefined();
    });

    it('should not update product. server error', async () => {
      const product = { id: uuid(), name: 'Legion 5i', price: 7000 };

      const response = {
        statusCode: 500,
        data: {},
        error: new ServerError()
      };

      updateProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body, error } = await request(sysUnderTest)
        .patch('/api/v1/products')
        .send(product);

      expect(status).toBe(response.statusCode);
      expect(body.error).toEqual(new ServerError().message);
      expect(error).toBeDefined();
    });
  });

  describe('PATCH - /products/:id/status/:status', () => {
    it('should update status', async () => {
      const product = { id: uuid(), status: ProductStatus.ENABLED };

      const response = {
        statusCode: 200,
        data: product
      };

      setProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body } = await request(sysUnderTest)
        .patch(`/api/v1/products/${product.id}/status/${product.status}`)
        .send({});

      expect(status).toBe(response.statusCode);
      expect(body).toEqual(expect.objectContaining(product));
    });
    it('should not update status. invalid status', async () => {
      const product = { id: uuid(), status: 'invalid_status' };

      const response = {
        statusCode: 400,
        data: {}
      };

      setProductControllerSpy.mockResolvedValueOnce(response);

      const { status, body } = await request(sysUnderTest)
        .patch(`/api/v1/products/${product.id}/status/${product.status}`)
        .send({});

      expect(status).toBe(response.statusCode);
      expect(body).toEqual({});
    });

    it('should not update status. server error', async () => {
      const product = { id: uuid(), status: ProductStatus.ENABLED };

      const response = {
        statusCode: 500
      };

      setProductControllerSpy.mockResolvedValueOnce(response);

      const { status, error } = await request(sysUnderTest)
        .patch(`/api/v1/products/${product.id}/status/${product.status}`)
        .send({});

      expect(status).toBe(response.statusCode);
      expect(error).toBeDefined();
    });
  });
});
