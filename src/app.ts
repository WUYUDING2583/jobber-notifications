import { winstonLogger } from '@wuyuding2583/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Express } from 'express-serve-static-core';
import express from 'express';
import { start } from '@notifications/server';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-app', 'debug');

function initialize(): void {
  const app: Express = express();
  start(app);
  log.info('Notification Service Initialized');
}

initialize();
