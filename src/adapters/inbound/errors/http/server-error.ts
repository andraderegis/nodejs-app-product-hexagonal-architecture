export class ServerError extends Error {
  constructor(error?: Error) {
    super(`Server error occured ${error ? ':'.concat(error.message) : '.'} Try again soon`);
    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}
