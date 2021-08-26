import Product, { ProductStatus } from '@application/domain/product';
import ProductService from '@application/services/product-service';

describe('ProductService', () => {
  let productService: ProductService;

  beforeAll(() => {
    productService = new ProductService();
  });

  describe('enable method', () => {
    it('should be enable product', async () => {
      const product = new Product('notebook', 5000);

      const productEnable = await productService.enable(product);

      expect(productEnable).toBeDefined();
      expect(productEnable.status).toEqual(ProductStatus.ENABLED);
    });
    it('should not be enable product', async () => {
      const product = new Product('notebook', 0);

      await expect(productService.enable(product)).rejects.toThrowError(
        'The price must be greater than zero to enable the product.'
      );
    });
  });

  describe('disable method', () => {
    it('should be disable product', async () => {
      const product = new Product('notebook', 0);

      const productEnable = await productService.disable(product);

      expect(productEnable).toBeDefined();
      expect(productEnable.status).toEqual(ProductStatus.DISABLED);
    });
    it('should not be disable product', async () => {
      const product = new Product('notebook', 5000);

      await expect(productService.disable(product)).rejects.toThrowError(
        'The price must be zero in order to have the product disabled.'
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
