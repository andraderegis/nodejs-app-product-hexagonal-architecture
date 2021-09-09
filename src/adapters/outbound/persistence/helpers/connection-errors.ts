export default class ConnectionNotFoundError extends Error {
  constructor() {
    super('Connection was not found');
    this.name = 'ConnectionNotFoundError';
  }
}
