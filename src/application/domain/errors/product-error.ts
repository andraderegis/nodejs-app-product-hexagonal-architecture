export class ProductError extends Error {
  constructor(message?: string, error?: Error) {
    super(message);
    this.name = 'ProductError';
    this.stack = error?.stack;
  }
}
