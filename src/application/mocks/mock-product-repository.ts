import Product from '@application/domain/product';
import ProductRepositoryPort from '@application/ports/product-repository-port';

class MockProductRepository implements ProductRepositoryPort {
  private products: Map<string, Product> = new Map();

  async get(id: string): Promise<Product> {
    return this.products.get(id);
  }

  async save(product: Product): Promise<Product> {
    this.products.set(product.id, product);

    return this.get(product.id);
  }

  async update(product: Product): Promise<Product> {
    const foundProduct = this.get(product.id);

    if (!foundProduct) {
      return undefined;
    }

    return this.save(product);
  }
}

export default MockProductRepository;
