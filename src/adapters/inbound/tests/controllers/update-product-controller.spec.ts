import ProductRepositoryPort from '@application/ports/product-repository-port';
import ProductServicePort from '@application/ports/product-service-port';
import { ProductService } from '@application/services';
import { UpdateProductController } from '@adapters/inbound/controllers';
import { ControllerInterface } from '@adapters/inbound/interfaces';
import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';
import MockPostgresqlDB from '@adapters/outbound/persistence/typeorm/mocks/mock-postgresql-db';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import Product from '@application/domain/product';
import { ServerError } from '@adapters/inbound/errors/http';

describe('Update Product Controller', () => {
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
    sysUnderTest = new UpdateProductController(productService);
  });

  it('should update product', async () => {
    const product = await productService.create({
      name: 'Notebook Legion Y530',
      price: 5000
    });

    const productToUpdate = {
      id: product.id,
      name: 'Notebook Lenovo Legion Y530',
      price: 6000
    };

    const { statusCode, data } = await sysUnderTest.execute({
      data: productToUpdate
    });

    expect(statusCode).toEqual(200);
    expect(data).toBeDefined();
    expect(data).toEqual(expect.objectContaining(productToUpdate));
  });

  it('should not update product. product not found', async () => {
    const product = new Product('Notebook Legion Y530', 5000);

    const { statusCode, data, error } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(400);
    expect(data).toEqual({});
    expect(error).toBeDefined();
    expect(error.message).toEqual(`product ${product.id} not found.`);
  });

  it('should not update product. invalid product price', async () => {
    const product = new Product('Notebook Legion Y530', -5000);

    const { statusCode, data, error } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(400);
    expect(data).toEqual({});
    expect(error).toBeDefined();
    expect(error.message).toEqual('The price must be greater or equal zero.');
  });
  it('should not update product. internal server error', async () => {
    const product = new Product('Notebook Legion Y530', 5000);

    jest.spyOn(productService, 'update').mockImplementationOnce(() => {
      throw new ServerError();
    });

    const { statusCode, data, error } = await sysUnderTest.execute({
      data: product
    });

    expect(statusCode).toEqual(500);
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
    expect(error.name).toEqual('ServerError');
  });
});
