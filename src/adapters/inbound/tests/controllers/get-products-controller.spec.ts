import { v4 as uuid } from 'uuid';

import { GetProductController } from '@adapters/inbound/controllers';
import { ControllerInterface } from '@adapters/inbound/interfaces/controller-interface';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import Product from '@application/domain/product';
import ProductServicePort from '@application/ports/product-service-port';
import { ProductService } from '@application/services';

describe('Get Product Controller', () => {
  let sysUnderTest: ControllerInterface;
  let productService: ProductServicePort;

  jest.mock('@adapters/outbound/persistence/typeorm/product-repository', () => ({
    ProductRepository: jest.fn().mockReturnValue({})
  }));

  beforeAll(async () => {
    productService = new ProductService(new ProductRepository());
    sysUnderTest = new GetProductController(productService);
  });

  it('should cannot found product', async () => {
    jest.spyOn(productService, 'get').mockResolvedValueOnce(undefined);

    const { statusCode, data } = await sysUnderTest.execute({
      data: {
        id: uuid()
      }
    });

    expect(statusCode).toBe(404);
    expect(data).toEqual({});
  });

  it('should find product', async () => {
    const product = new Product('notebook', 5000);

    jest.spyOn(productService, 'get').mockResolvedValueOnce(product);

    const { statusCode, data } = await sysUnderTest.execute({
      data: {
        id: product.id
      }
    });

    expect(statusCode).toBe(200);
    expect(product).toEqual(expect.objectContaining(data));
  });
});
