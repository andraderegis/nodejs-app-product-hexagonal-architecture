import { IBackup } from 'pg-mem';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import Product, { ProductStatus } from '@application/domain/product';

import BaseRepository from '@adapters/outbound/persistence/typeorm/base-repository';
import ProductRepository from '@adapters/outbound/persistence/typeorm/product-repository';
import { ProductEntity } from '@adapters/outbound/persistence/typeorm/entities';

import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';
import MockPostgresqlDB from '@adapters/outbound/persistence/typeorm/mocks/mock-postgresql-db';

describe('Product Repository Tests', () => {
  let sysUnderTest: ProductRepository;
  let connection: DBConnection;
  let dbBackup: IBackup;
  let repository: Repository<ProductEntity>;

  beforeAll(async () => {
    connection = DBConnection.getInstance();

    const db = await MockPostgresqlDB.make([ProductEntity]);

    dbBackup = db.backup();

    repository = connection.getRepository(ProductEntity);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  beforeEach(() => {
    dbBackup.restore();

    sysUnderTest = new ProductRepository();
  });

  it('should be extended BaseRepository', async () => {
    expect(sysUnderTest).toBeInstanceOf(BaseRepository);
  });

  describe('get method', () => {
    it('should return a product by id', async () => {
      const product = await repository.save({
        id: uuid(),
        name: 'notebook',
        price: 5000,
        status: ProductStatus.ENABLED
      });

      const foundProduct = await sysUnderTest.get(product.id);

      expect(foundProduct).toBeDefined();
      expect(foundProduct).toEqual(expect.objectContaining(product));
    });

    it('should not return a product by id. product not exists', async () => {
      const notFoundProduct = await sysUnderTest.get(uuid());

      expect(notFoundProduct).toBeUndefined();
    });
  });

  describe('save method', () => {
    it('should be save a product', async () => {
      const productData = {
        id: uuid(),
        name: 'notebook',
        price: 5000,
        status: ProductStatus.ENABLED
      } as Product;

      const product = await sysUnderTest.save(productData);

      expect(product).toBeDefined();
      expect(product).toEqual(expect.objectContaining(productData));
    });
  });

  describe('update method', () => {
    it('should be update a product ', async () => {
      const productData = {
        id: uuid(),
        name: 'notebook',
        price: 5000,
        status: ProductStatus.ENABLED
      } as Product;

      const savedProduct = await repository.save(productData);

      const productToUpdate = Object.assign(savedProduct, {
        name: 'Notebook Lenovo Legion Y530'
      });

      const productUpdated = await sysUnderTest.update(productToUpdate);

      expect(productUpdated).toBeDefined();
      expect(productUpdated.name).toEqual(productToUpdate.name);
    });

    it('should save a nonexistent product ', async () => {
      const productData = {
        id: uuid(),
        name: 'notebook',
        price: 5000,
        status: ProductStatus.ENABLED
      } as Product;

      const productToUpdate = await sysUnderTest.get(productData.id);
      expect(productToUpdate).toBeUndefined();

      const productUpdated = await sysUnderTest.update(productData);

      expect(productUpdated).toBeDefined();
      expect(productUpdated.name).toEqual(productData.name);
    });
  });
});
