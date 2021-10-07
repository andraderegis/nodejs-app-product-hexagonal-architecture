import Product from '@application/domain/product';

export type CreateParams = {
  name: string;
  price: number;
};
export default interface ProductServicePort {
  create({ name, price }: CreateParams): Promise<Product>;
  disable(id: string): Promise<Product>;
  enable(id: string): Promise<Product>;
  get(id: string): Promise<Product>;
  update(product: Product): Promise<Product>;
  validate(product: Product): Promise<void>;
}
