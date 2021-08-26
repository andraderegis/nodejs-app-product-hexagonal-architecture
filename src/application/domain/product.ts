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
}

export default Product;
