import Product, { ProductStatus } from '@application/domain/product';
import ProductServicePort from '@application/ports/product-service-port';

class ProductService implements ProductServicePort {
  async validate(product: Product): Promise<void> {
    if (product.price < 0) {
      throw new Error('The price must be greater or equal zero.');
    }

    return Promise.resolve();
  }

  async enable(product: Product): Promise<Product> {
    if (product.price > 0) {
      return Object.create({
        ...product,
        status: ProductStatus.ENABLED
      });
    }
    throw new Error('The price must be greater than zero to enable the product.');
  }

  async disable(product: Product): Promise<Product> {
    if (product.price === 0) {
      return Object.create({
        ...product,
        status: ProductStatus.DISABLED
      });
    }
    throw new Error('The price must be zero in order to have the product disabled.');
  }
}

export default ProductService;
