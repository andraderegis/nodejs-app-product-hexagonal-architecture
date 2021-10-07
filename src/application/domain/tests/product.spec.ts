import Product from '@application/domain/product';
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
      const id = v4();
      const product = new Product('notebook', 5000, id);

      expect(validateSpy).toHaveBeenCalled();
      expect(id).toEqual(product.id);
    });
    it('should be create without informed id', () => {
      validateSpy = jest.fn().mockReturnValueOnce(false);

      const product = new Product('notebook', 5000);

      expect(v4Spy).toHaveBeenCalledTimes(1);
      expect(product).toBeDefined();
    });
  });
});
