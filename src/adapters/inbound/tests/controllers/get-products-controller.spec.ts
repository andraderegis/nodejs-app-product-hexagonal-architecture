import { GetProductController } from '@adapters/inbound/controllers';
import { ControllerInterface } from '@adapters/inbound/interfaces/controller-interface';
import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';
import MockPostgresqlDB from '@adapters/outbound/persistence/typeorm/mocks/mock-postgresql-db';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import Product from '@application/domain/product';
import ProductRepositoryPort from '@application/ports/product-repository-port';
import ProductServicePort from '@application/ports/product-service-port';
import ProductService from '@application/services/product-service';

describe('Get Product Controller', () => {
  let sysUnderTest: ControllerInterface;
  let productService: ProductServicePort;
  let productRepository: ProductRepositoryPort;

  beforeAll(async () => {
    await MockPostgresqlDB.make();

    const dbConnection = DBConnection.getInstance();

    productRepository = new ProductRepository(dbConnection);

    productService = new ProductService(productRepository);
  });

  beforeEach(() => {
    sysUnderTest = new GetProductController(productService);
  });

  it('should cannot found product', async () => {
    const { statusCode, data } = await sysUnderTest.execute({
      data: {
        id: 'a2b9fb59-ba1e-4e16-a063-3b11216337cc'
      }
    });

    expect(statusCode).toEqual(404);
    expect(data).toBeUndefined();
  });

  it('should find product', async () => {
    const product = new Product('notebook', 5000);

    const savedProduct = await productRepository.save(product);

    const { statusCode, data } = await sysUnderTest.execute({
      data: {
        id: savedProduct.id
      }
    });

    expect(statusCode).toEqual(200);
    expect(savedProduct).toEqual(expect.objectContaining(data));
  });
});
