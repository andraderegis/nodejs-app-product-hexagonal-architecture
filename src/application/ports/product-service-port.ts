import Product from '@application/domain/product';

export type CreateParams = {
  name: string;
  price: number;
};
export default interface ProductServicePort {
  create({ name, price }: CreateParams): Promise<Product>;
  disable(product: Product): Promise<Product>;
  enable(product: Product): Promise<Product>;
  get(id: string): Promise<Product>;
}
