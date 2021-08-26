import { v4 as uuid } from 'uuid';

// eslint-disable-next-line no-shadow
export enum ProductStatus {
  DISABLED = 'disabled',
  ENABLED = 'enabled'
}

class Product {
  id: string;

  name: string;

  price: number;

  status: ProductStatus;

  constructor(name: string, price: number) {
    this.id = uuid();
    this.status = ProductStatus.DISABLED;
    this.name = name;
    this.price = price;
  }

  async validate(): Promise<void> {
    if (this.price < 0) {
      throw new Error('The price must be greater or equal zero.');
    }

    return Promise.resolve();
  }

  async enable(): Promise<Product> {
    if (this.price > 0) {
      this.status = ProductStatus.ENABLED;
      return this;
    }

    throw new Error('The price must be greater than zero to enable the product.');
  }

  async disable(): Promise<Product> {
    if (this.price === 0) {
      this.status = ProductStatus.DISABLED;
      return this;
    }

    throw new Error('The price must be zero in order to have the product disabled.');
  }
}

export default Product;
