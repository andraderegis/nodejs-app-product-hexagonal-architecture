import { ControllerInterface } from '@adapters/inbound/interfaces';
import { CreateProductController } from '@adapters/inbound/controllers';
import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';
import MockPostgresqlDB from '@adapters/outbound/persistence/typeorm/mocks/mock-postgresql-db';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import ProductRepositoryPort from '@application/ports/product-repository-port';
import ProductServicePort from '@application/ports/product-service-port';
import { ProductService } from '@application/services';
import { ProductError } from '@application/domain/errors/product-error';

describe('Create Product Controller', () => {
  let sysUnderTest: ControllerInterface;
  let productService: ProductServicePort;
  let productRepository: ProductRepositoryPort;

  const productErrorName = new ProductError().name;

  beforeAll(async () => {
    await MockPostgresqlDB.make();

    const dbConnection = DBConnection.getInstance();

    productRepository = new ProductRepository(dbConnection);

    productService = new ProductService(productRepository);
  });

  beforeEach(() => {
    sysUnderTest = new CreateProductController(productService);
  });

  it('should create product', async () => {
    const product = {
      name: 'Notebook Lenovo Legion Y530',
      price: 5000
    };

    const { statusCode, data } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(201);
    expect(data).toBeDefined();
    expect(data).toEqual(expect.objectContaining(product));
  });
  it('should not create product. price not informed', async () => {
    const product = {
      name: 'Notebook Lenovo Legion Y530'
    };

    const { statusCode, data } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(400);
    expect(data).toBeUndefined();
  });
  it('should not create product. price lower 0', async () => {
    const product = {
      name: 'Notebook Lenovo Legion Y530',
      price: -1000
    };

    const { statusCode, data, error } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(400);
    expect(data).toBeUndefined();
    expect(error.name).toEqual(productErrorName);
    expect(error.message).toContain('The price must be greater or equal zero.');
  });
});
