import { v4 as uuid } from 'uuid';

import { ProductService } from '@application/services';
import { ProductError } from '@application/domain/errors/product-error';
import ProductServicePort from '@application/ports/product-service-port';

import { UpdateProductController } from '@adapters/inbound/controllers';
import { ControllerInterface } from '@adapters/inbound/interfaces';
import { ServerError } from '@adapters/inbound/errors/http';
import Product from '@application/domain/product';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';

describe('Update Product Controller', () => {
  let sysUnderTest: ControllerInterface;
  let productService: ProductServicePort;

  jest.mock('@adapters/outbound/persistence/typeorm/product-repository', () => ({
    ProductRepository: jest.fn().mockReturnValue({})
  }));

  beforeAll(async () => {
    productService = new ProductService(new ProductRepository());
    sysUnderTest = new UpdateProductController(productService);
  });

  it('should update product', async () => {
    const productToUpdate = {
      id: uuid(),
      name: 'Notebook Lenovo Legion Y530',
      price: 6000
    };

    jest.spyOn(productService, 'update').mockResolvedValueOnce(productToUpdate as Product);

    const { statusCode, data } = await sysUnderTest.execute({
      data: productToUpdate
    });

    expect(statusCode).toEqual(200);
    expect(data).toEqual(expect.objectContaining(productToUpdate));
  });

  it('should not update product. bad request', async () => {
    const product = {
      id: uuid(),
      name: 'Notebook Lenovo Legion Y530',
      price: 6000
    };

    jest.spyOn(productService, 'update').mockImplementationOnce(() => {
      throw new ProductError();
    });

    const { statusCode, error } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(400);
    expect(error.name).toEqual('ProductError');
  });
  it('should not update product. internal server error', async () => {
    const product = { name: 'Notebook Legion Y530', price: 5000 };

    jest.spyOn(productService, 'update').mockImplementationOnce(() => {
      throw new ServerError();
    });

    const { statusCode, error } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(500);
    expect(error.name).toEqual('ServerError');
  });
});
