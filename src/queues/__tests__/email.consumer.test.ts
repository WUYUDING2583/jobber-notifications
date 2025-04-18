import * as connection from '@notifications/queues/connection';
import amqp from 'amqplib';
import { consumeAuthEmailMessage, consumeOrderEmailMessage } from '@notifications/queues/email.consumer';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@wuyuding2583/jobber-shared');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessage method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
        publish: jest.fn()
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockResolvedValue(channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await consumeAuthEmailMessage(connectionChannel!);
      expect(channel.assertExchange).toHaveBeenCalledWith('jobber-email-notification', 'direct');
      expect(channel.assertQueue).toHaveBeenCalledTimes(1);
      expect(channel.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'jobber-email-notification', 'auth-email');
      expect(channel.consume).toHaveBeenCalledTimes(1);
    });
  });

  describe('consumeOrderEmailMessage method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
        publish: jest.fn()
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'order-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockResolvedValue(channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await consumeOrderEmailMessage(connectionChannel!);
      expect(channel.assertExchange).toHaveBeenCalledWith('jobber-order-notification', 'direct');
      expect(channel.assertQueue).toHaveBeenCalledTimes(1);
      expect(channel.bindQueue).toHaveBeenCalledWith('order-email-queue', 'jobber-order-notification', 'order-email');
      expect(channel.consume).toHaveBeenCalledTimes(1);
    });
  });
});
