import mongoose from 'mongoose';
import { env } from '@/config/env';
import { dbLogger } from '@/config/logger';
import { LOG_MESSAGES } from '@/constants/log-messages';

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    dbLogger.info(LOG_MESSAGES.DB_CONNECTED);
  });

  mongoose.connection.on('error', (err: Error) => {
    dbLogger.error(LOG_MESSAGES.DB_CONNECTION_ERROR, { error: err.message, stack: err.stack });
  });

  mongoose.connection.on('disconnected', () => {
    dbLogger.warn(LOG_MESSAGES.DB_DISCONNECTED);
  });

  await mongoose.connect(env.mongodbUri);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  dbLogger.info(LOG_MESSAGES.DB_DISCONNECTED);
}
