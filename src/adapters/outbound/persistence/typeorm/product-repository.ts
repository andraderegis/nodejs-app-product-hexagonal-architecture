import Product from '@application/domain/product';
import ProductRepositoryPort from '@application/ports/product-repository-port';
import BaseRepository from '@adapters/outbound/persistence/typeorm/base-repository';
import ProductEntity from './entities/product-entity';

class ProductRepository extends BaseRepository implements ProductRepositoryPort {
  async get(id: string): Promise<Product> {
    const product = await this.getRepository(ProductEntity).findOne({
      where: {
        id
      }
    });

    return product ? (Object.fromEntries(Object.entries(product)) as Product) : undefined;
  }

  async save(product: Product): Promise<Product> {
    const repository = this.getRepository(ProductEntity);

    const createdProduct = repository.create(product);
    const savedProduct = await repository.save(createdProduct);

    return Object.fromEntries(Object.entries(savedProduct)) as Product;
  }

  async update(product: Product): Promise<Product> {
    const { id } = product;

    const { affected } = await this.getRepository(ProductEntity).update(
      {
        id
      },
      {
        ...product
      }
    );

    return affected ? this.get(id) : undefined;
  }
}

export default ProductRepository;
