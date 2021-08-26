import Product, { ProductStatus } from '@application/domain/product';

describe('Product Tests', () => {
  describe('enable method', () => {
    it('should be enable product', async () => {
      let product = new Product('notebook', 5000);

      product = await product.enable();

      expect(product.status).toEqual(ProductStatus.ENABLED);
    });
    it('should not be enable product', async () => {
      const product = new Product('notebook', 0);

      await expect(product.enable()).rejects.toThrowError(
        'The price must be greater than zero to enable the product.'
      );
    });
  });

  describe('disable method', () => {
    it('should be disable product', async () => {
      let product = new Product('notebook', 0);

      product = await product.disable();

      expect(product.status).toEqual(ProductStatus.DISABLED);
    });

    it('should not be disable product', async () => {
      const product = new Product('notebook', 5000);

      await expect(product.disable()).rejects.toThrowError(
        'The price must be zero in order to have the product disabled.'
      );
    });
  });

  describe('validate method', () => {
    it('should be valid product', async () => {
      const product = new Product('notebook', 0);

      await expect(product.validate()).resolves.toBeUndefined();
    });
    it('should be invalid product. price is minor than 0', async () => {
      const product = new Product('notebook', -10);

      await expect(product.validate()).rejects.toThrowError(
        'The price must be greater or equal zero.'
      );
    });
  });
});
