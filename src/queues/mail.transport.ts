import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helper';
import { IEmailLocals, winstonLogger } from '@wuyuding2583/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-mail-transport ', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    await emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log('error', 'notification-mail-transport sendEmail() method:', error);
  }
}

export { sendEmail };
