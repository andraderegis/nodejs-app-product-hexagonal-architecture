import Product, { ProductStatus } from '@application/domain/product';
import { mocked } from 'ts-jest/utils';
import { v4, validate } from 'uuid';

jest.mock('uuid', () => ({
  validate: jest.fn(),
  v4: jest.fn()
}));

describe('Product Tests', () => {
  let validateSpy: jest.Mock;
  let v4Spy: jest.Mock;

  beforeAll(() => {
    validateSpy = jest.fn().mockReturnValue(true);
    mocked(validate).mockImplementation(validateSpy);

    v4Spy = jest.fn().mockReturnValue('49fe94e7-e052-4925-bb6c-15274c18c602');
    mocked(v4).mockImplementation(v4Spy);
  });
  describe('constructor method', () => {
    it('should be create with informed id', () => {
      const id = v4Spy();
      const product = new Product('notebook', 5000, id);

      expect(validateSpy).toBeCalled();
      expect(id).toEqual(product.id);
    });
    it('should be create without informed id', () => {
      const product = new Product('notebook', 5000);

      expect(v4Spy).toBeCalled();
      expect(product).toBeDefined();
    });
  });
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
});
