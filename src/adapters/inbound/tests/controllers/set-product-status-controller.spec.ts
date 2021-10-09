import ProductServicePort from '@application/ports/product-service-port';
import { ProductService } from '@application/services';
import { SetProductStatusController } from '@adapters/inbound/controllers';
import { ControllerInterface } from '@adapters/inbound/interfaces';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import Product, { ProductStatus } from '@application/domain/product';

describe('Set Product Status Controller', () => {
  let sysUnderTest: ControllerInterface;
  let productService: ProductServicePort;

  jest.mock('@adapters/outbound/persistence/typeorm/product-repository', () => ({
    ProductRepository: jest.fn().mockReturnValue({})
  }));

  beforeAll(async () => {
    productService = new ProductService(new ProductRepository());

    sysUnderTest = new SetProductStatusController(productService);
  });

  it('should set enabled status', async () => {
    const product = new Product('Notebook Legion Y530', 5000);

    jest.spyOn(productService, 'enable').mockResolvedValueOnce({
      ...product,
      status: ProductStatus.ENABLED
    });

    const { statusCode, data } = await sysUnderTest.execute({
      data: {
        id: product.id,
        status: ProductStatus.ENABLED
      }
    });

    expect(statusCode).toBe(200);
    expect(data.status).toEqual(ProductStatus.ENABLED);
  });

  it('should set disabled status', async () => {
    const product = new Product('Notebook Legion Y530', 5000);

    jest.spyOn(productService, 'disable').mockResolvedValueOnce({
      ...product,
      status: ProductStatus.DISABLED
    });

    const { statusCode, data } = await sysUnderTest.execute({
      data: {
        id: product.id,
        status: ProductStatus.DISABLED
      }
    });

    expect(statusCode).toBe(200);
    expect(data.status).toEqual(ProductStatus.DISABLED);
  });

  it('should invalid status', async () => {
    const product = new Product('Notebook Legion Y530', 0);

    const { statusCode, error } = await sysUnderTest.execute({
      data: {
        id: product.id,
        status: 'invalid_status'
      }
    });

    expect(statusCode).toBe(400);
    expect(error.message).toEqual('invalid product status');
  });
});
