import { ProductError } from '@application/domain/errors/product-error';
import { ProductService } from '@application/services';
import ProductServicePort from '@application/ports/product-service-port';
import Product from '@application/domain/product';

import { ControllerInterface } from '@adapters/inbound/interfaces';
import { CreateProductController } from '@adapters/inbound/controllers';
import { ServerError } from '@adapters/inbound/errors/http';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';

describe('Create Product Controller', () => {
  let sysUnderTest: ControllerInterface;
  let productService: ProductServicePort;

  jest.mock('@adapters/outbound/persistence/typeorm/product-repository', () => ({
    ProductRepository: jest.fn().mockReturnValue({})
  }));

  beforeAll(async () => {
    productService = new ProductService(new ProductRepository());

    sysUnderTest = new CreateProductController(productService);
  });

  it('should create product', async () => {
    const product = {
      name: 'Notebook Lenovo Legion Y530',
      price: 5000
    };

    jest.spyOn(productService, 'create').mockResolvedValueOnce(product as Product);

    const { statusCode, data } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(201);
    expect(data).toEqual(expect.objectContaining(product));
  });

  it('should not create product. bad request error', async () => {
    const product = {
      name: 'Notebook Lenovo Legion Y530',
      price: 5000
    };

    jest.spyOn(productService, 'create').mockImplementationOnce(() => {
      throw new ProductError();
    });

    const { statusCode, error } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(400);
    expect(error.name).toEqual('ProductError');
  });
  it('should not create product. server error', async () => {
    const product = {
      name: 'Notebook Lenovo Legion Y530',
      price: 5000
    };

    jest.spyOn(productService, 'create').mockImplementationOnce(() => {
      throw new ServerError();
    });

    const { statusCode, error } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(500);
    expect(error.name).toEqual('ServerError');
  });
});
