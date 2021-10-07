import { v4 as uuid, validate as uuidValidate } from 'uuid';

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
}

export default Product;
