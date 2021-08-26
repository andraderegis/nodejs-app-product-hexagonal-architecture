import Product from '@application/domain/product';

export default interface ProductServicePort {
  validate(product: Product): Promise<void>;
  enable(product: Product): Promise<Product>;
  disable(product: Product): Promise<Product>;
}
