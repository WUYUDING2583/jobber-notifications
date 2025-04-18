import { winstonLogger } from '@wuyuding2583/jobber-shared';
// import 'express-async-errors';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express-serve-static-core';
import http from 'http';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessage, consumeOrderEmailMessage } from '@notifications/queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-service', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('/', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessage(emailChannel);
  await consumeOrderEmailMessage(emailChannel);

  // const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=asdfjkhkjiiowefasd`;
  // const messageDetail: IEmailMessageDetails = {
  //   receiverEmail: `${config.SENDER_EMAIL}`,
  //   resetLink: verificationLink,
  //   username: 'John Doe',
  //   template: 'forgotPassword'
  // };
  // emailChannel.assertExchange('jobber-email-notification', 'direct');
  // const message = JSON.stringify(messageDetail);
  // emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message));

  // emailChannel.assertExchange('jobber-order-notification', 'direct');
  // const message1 = JSON.stringify({ name: 'John', service: 'order email' });
  // emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(message1));
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = http.createServer(app);
    log.info(`Worker with process id of ${process.pid} on notification service has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification service is running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'Notification Service startServer() method:', error);
  }
}
