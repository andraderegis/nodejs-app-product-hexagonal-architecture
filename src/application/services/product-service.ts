import Product from '@application/domain/product';
import ProductRepositoryPort from '@application/ports/product-repository-port';
import ProductServicePort, { CreateParams } from '@application/ports/product-service-port';

class ProductService implements ProductServicePort {
  constructor(private productRepository: ProductRepositoryPort) {}

  async create({ name, price }: CreateParams): Promise<Product> {
    const product = new Product(name, price);

    await product.validate();

    return this.productRepository.save(product);
  }

  async get(id: string): Promise<Product> {
    return this.productRepository.get(id);
  }

  async enable(product: Product): Promise<Product> {
    await product.enable();

    return this.productRepository.save(product);
  }

  async disable(product: Product): Promise<Product> {
    await product.disable();

    return this.productRepository.save(product);
  }
}

export default ProductService;
