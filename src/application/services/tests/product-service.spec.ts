import { v4 as uuid } from 'uuid';

import Product, { ProductStatus } from '@application/domain/product';
import MockProductRepository from '@application/mocks/mock-product-repository';
import ProductRepositoryPort from '@application/ports/product-repository-port';
import { ProductService } from '@application/services';

describe('ProductService Tests', () => {
  let productService: ProductService;
  let productRespository: ProductRepositoryPort;

  beforeEach(() => {
    productRespository = new MockProductRepository();
    productService = new ProductService(productRespository);
  });

  describe('get method', () => {
    it('should be get product', async () => {
      const product = await productRespository.save(new Product('notebook', 6000));

      const retrievedProduct = await productService.get(product.id);

      expect(product).toEqual(expect.objectContaining(retrievedProduct));
    });
    it('should not get product. not found product', async () => {
      const product = await productService.get(uuid());

      expect(product).toBeUndefined();
    });
  });

  describe('save method', () => {
    it('should be save product', async () => {
      const productData = { name: 'notebook', price: 6000 };
      const product = await productService.create(productData);

      expect(product).toEqual(expect.objectContaining(productData));
    });
    it('should not be save product', async () => {
      const productData = { name: 'notebook', price: -10 };

      await expect(productService.create(productData)).rejects.toThrowError(
        'The price must be greater or equal zero.'
      );
    });
  });

  describe('enable method', () => {
    it('should be enable product', async () => {
      const product = await productRespository.save(new Product('notebook', 5000));
      expect(product.status).toEqual(ProductStatus.DISABLED);

      const enabledProduct = await productService.enable(product.id);
      expect(enabledProduct.status).toEqual(ProductStatus.ENABLED);
    });
    it('should not be enable product. not found product', async () => {
      const id = uuid();

      await expect(productService.enable(id)).rejects.toThrowError(`product ${id} not found.`);
    });
    it('should not be enable product. price must be greater than zero', async () => {
      const product = await productRespository.save(new Product('notebook', 0));

      await expect(productService.enable(product.id)).rejects.toThrowError(
        'The price must be greater than zero to enable the product.'
      );
    });
  });
  describe('disable method', () => {
    it('should be disable product', async () => {
      const savedProduct = await productRespository.save(new Product('notebook', 0));

      const disabledProduct = await productService.disable(savedProduct.id);

      expect(disabledProduct.status).toEqual(ProductStatus.DISABLED);
    });

    it('should not be disable product. not found product', async () => {
      const id = uuid();

      await expect(productService.disable(id)).rejects.toThrowError(`product ${id} not found.`);
    });

    it('should not be disable product. price must be zero', async () => {
      const product = await productRespository.save(new Product('notebook', 1000));

      await expect(productService.disable(product.id)).rejects.toThrowError(
        'The price must be zero in order to have the product disabled.'
      );
    });
  });

  describe('update method', () => {
    it('should be update product', async () => {
      const product = await productRespository.save(new Product('notebook', 5000));

      const productToUpdate = { ...product, name: 'Notebook Lenovo Legion Y530' } as Product;
      const productUpdated = await productService.update(productToUpdate);

      expect(productUpdated).toBeDefined();
      expect(productUpdated.name).toEqual(productToUpdate.name);
    });

    it('should not update product. product not found', async () => {
      const product = new Product('notebook acer nitro 5', 5000);

      await expect(productService.update(product)).rejects.toThrowError(
        `product ${product.id} not found`
      );
    });
    it('should not update product. price must be greather or equal zero', async () => {
      const product = await productRespository.save(new Product('notebook acer nitro 5', 6000));

      const productToUpdate = { ...product, price: -10 } as Product;

      await expect(productService.update(productToUpdate)).rejects.toThrowError(
        `The price must be greater or equal zero.`
      );
    });
  });

  describe('validate method', () => {
    it('should be valid product', async () => {
      const product = new Product('notebook', 0);

      await expect(productService.validate(product)).resolves.toBeUndefined();
    });
    it('should be invalid product. price is minor than 0', async () => {
      const product = new Product('notebook', -10);

      await expect(productService.validate(product)).rejects.toThrowError(
        'The price must be greater or equal zero.'
      );
    });
  });
});
