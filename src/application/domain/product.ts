import { v4 as uuid, validate as uuidValidate } from 'uuid';
import { ProductError } from './errors/product-error';

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

  constructor(name: string, price: number, id?: string) {
    this.id = id && uuidValidate(id) ? id : uuid();
    this.status = ProductStatus.DISABLED;
    this.name = name;
    this.price = price;
  }

  async enable(): Promise<Product> {
    if (this.price > 0) {
      this.status = ProductStatus.ENABLED;
      return this;
    }

    throw new ProductError('The price must be greater than zero to enable the product.');
  }

  async disable(): Promise<Product> {
    if (this.price === 0) {
      this.status = ProductStatus.DISABLED;
      return this;
    }

    throw new ProductError('The price must be zero in order to have the product disabled.');
  }
}

export default Product;
