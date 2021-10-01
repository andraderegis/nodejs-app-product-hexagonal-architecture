import { ProductError } from '@application/domain/errors/product-error';
import Product from '@application/domain/product';
import ProductRepositoryPort from '@application/ports/product-repository-port';
import ProductServicePort, { CreateParams } from '@application/ports/product-service-port';

export class ProductService implements ProductServicePort {
  constructor(private productRepository: ProductRepositoryPort) {}

  async create({ name, price }: CreateParams): Promise<Product> {
    const product = new Product(name, price);

    await this.validate(product);

    return this.productRepository.save(product);
  }

  async get(id: string): Promise<Product> {
    return this.productRepository.get(id);
  }

  async update(product: Product): Promise<Product> {
    const foundProduct = await this.productRepository.get(product.id);

    await this.validate(product);

    if (!foundProduct) {
      throw new ProductError(`product ${product.id} not found.`);
    }

    return this.productRepository.update(product);
  }

  async enable(product: Product): Promise<Product> {
    await product.enable();

    return this.productRepository.save(product);
  }

  async disable(product: Product): Promise<Product> {
    await product.disable();

    return this.productRepository.save(product);
  }

  async validate(product: Product): Promise<void> {
    if (product.price < 0) {
      throw new ProductError('The price must be greater or equal zero.');
    }

    return Promise.resolve();
  }
}
