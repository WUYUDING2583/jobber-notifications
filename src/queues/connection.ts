import { config } from '@notifications/config';
import { winstonLogger } from '@wuyuding2583/jobber-shared';
import amqplib, { Channel, ChannelModel } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-queue-connection ', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: ChannelModel = await amqplib.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('notification-service connect to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'notification-service createConnection() method:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: ChannelModel): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection, closeConnection };
