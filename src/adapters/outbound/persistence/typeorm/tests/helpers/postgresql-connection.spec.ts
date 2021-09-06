import { mocked } from 'ts-jest/utils';
import { createConnection, getConnection, getConnectionManager } from 'typeorm';

import PostgreSQLConnection from '@adapters/outbound/persistence/typeorm/helpers/postgresql-connection';

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn(),
  getRepository: jest.fn()
}));

describe('Postgresql Connection Tests', () => {
  let sysUnderTest: PostgreSQLConnection;

  let hasSpy: jest.Mock;
  let createConnectionSpy: jest.Mock;
  let getConnectionSpy: jest.Mock;
  let getConnectionManagerSpy: jest.Mock;

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true);

    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy
    });
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);

    createConnectionSpy = jest.fn().mockResolvedValue({});
    mocked(createConnection).mockImplementation(createConnectionSpy);

    getConnectionSpy = jest.fn().mockReturnValue({});
    mocked(getConnection).mockImplementation(getConnectionSpy);
  });

  beforeEach(() => {
    sysUnderTest = PostgreSQLConnection.getInstance();
  });
  describe('getInstance method', () => {
    it('should have only get unique instance', () => {
      const systemUnderTest2 = PostgreSQLConnection.getInstance();

      expect(sysUnderTest).toBe(systemUnderTest2);
    });
  });

  describe('connection method', () => {
    it('should create a new connection', async () => {
      hasSpy.mockReturnValueOnce(false);

      await sysUnderTest.connect();

      expect(createConnectionSpy).toHaveBeenCalledWith();
      expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    });

    it('should use already opened connection', async () => {
      await sysUnderTest.connect();

      expect(getConnectionSpy).toHaveBeenCalledWith();
      expect(getConnectionSpy).toHaveBeenCalledTimes(1);
    });
  });
});