import { mocked } from 'ts-jest/utils';
import { createConnection, getConnection, getConnectionManager } from 'typeorm';

import DBConnection from '@adapters/outbound/persistence/typeorm/helpers/db-connection';
import ConnectionNotFoundError from '@adapters/outbound/persistence/helpers/connection-errors';

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn(),
  getRepository: jest.fn()
}));

describe('DB Connection Tests', () => {
  let sysUnderTest: DBConnection;

  let hasSpy: jest.Mock;
  let createConnectionSpy: jest.Mock;
  let closeSpy: jest.Mock;
  let getConnectionSpy: jest.Mock;
  let getConnectionManagerSpy: jest.Mock;

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true);
    closeSpy = jest.fn();

    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy
    });
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);

    createConnectionSpy = jest.fn().mockResolvedValue({});
    mocked(createConnection).mockImplementation(createConnectionSpy);

    getConnectionSpy = jest.fn().mockReturnValue({
      close: closeSpy
    });
    mocked(getConnection).mockImplementation(getConnectionSpy);
  });

  beforeEach(() => {
    sysUnderTest = DBConnection.getInstance();
  });
  describe('getInstance method', () => {
    it('should have only get unique instance', () => {
      const systemUnderTest2 = DBConnection.getInstance();

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

  describe('disconnect method', () => {
    it('should close connection', async () => {
      hasSpy.mockReturnValueOnce(false);

      await sysUnderTest.connect();
      await sysUnderTest.disconnect();

      expect(closeSpy).toHaveBeenCalledWith();
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
    it('should return close connection error ConnectionNotFoundError', async () => {
      const disconnect = sysUnderTest.disconnect();

      await expect(disconnect).rejects.toThrow(new ConnectionNotFoundError());
    });
  });
});
