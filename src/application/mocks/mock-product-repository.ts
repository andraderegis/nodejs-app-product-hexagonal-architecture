import Product from '@application/domain/product';
import ProductRepositoryPort from '@application/ports/product-repository-port';

class MockProductRepository implements ProductRepositoryPort {
  private products: Product[] = [];

  async get(id: string): Promise<Product> {
    return this.products.find(product => product.id === id);
  }

  async save(product: Product): Promise<Product> {
    this.products.push(product);

    return this.get(product.id);
  }
}

export default MockProductRepository;
