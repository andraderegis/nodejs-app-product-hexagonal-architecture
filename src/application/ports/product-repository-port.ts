import Product from '@application/domain/product';

export default interface ProductRepositoryPort {
  get(id: string): Promise<Product>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
}
