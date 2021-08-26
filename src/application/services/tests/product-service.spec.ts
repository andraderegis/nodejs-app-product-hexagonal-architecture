import Product, { ProductStatus } from '@application/domain/product';
import MockProductRepository from '@application/mocks/mock-product-repository';
import ProductRepositoryPort from '@application/ports/product-repository-port';
import ProductService from '@application/services/product-service';

describe('ProductService Tests', () => {
  let productService: ProductService;
  let productRespository: ProductRepositoryPort;

  beforeEach(() => {
    productRespository = new MockProductRepository();
    productService = new ProductService(productRespository);
  });

  describe('get method', () => {
    it('should be get product', async () => {
      const product = await productService.create({ name: 'notebook', price: 6000 });

      const retrievedProduct = await productService.get(product.id);

      expect(product).toEqual(expect.objectContaining(retrievedProduct));
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
      const product = new Product('notebook', 6000);
      expect(product.status).toEqual(ProductStatus.DISABLED);

      const savedProduct = await productService.enable(product);

      expect(savedProduct.status).toEqual(ProductStatus.ENABLED);
      expect(product).toEqual(expect.objectContaining(savedProduct));
    });
    it('should not be enable product', async () => {
      const product = new Product('notebook', -10);

      await expect(productService.enable(product)).rejects.toThrowError(
        'The price must be greater than zero to enable the product.'
      );
    });
  });
  describe('disable method', () => {
    it('should be disable product', async () => {
      const product = new Product('notebook', 0);

      const savedProduct = await productService.disable(product);

      expect(savedProduct.status).toEqual(ProductStatus.DISABLED);
      expect(product).toEqual(expect.objectContaining(savedProduct));
    });
    it('should not be disable product', async () => {
      const product = new Product('notebook', -10);

      await expect(productService.disable(product)).rejects.toThrowError(
        'The price must be zero in order to have the product disabled.'
      );
    });
  });
});
