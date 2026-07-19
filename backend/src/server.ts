import app from './app';
import { env } from '@/config/env';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { serverLogger } from '@/config/logger';
import { LOG_MESSAGES } from '@/constants/log-messages';

async function bootstrap(): Promise<void> {
  // Application startup sequence
  serverLogger.info(LOG_MESSAGES.SERVER_STARTING);

  await connectDatabase();

  const server = app.listen(env.port, () => {
    serverLogger.info(LOG_MESSAGES.SERVER_RUNNING, {
      url: env.serverUrl,
    });
    serverLogger.info(LOG_MESSAGES.SERVER_SWAGGER, {
      url: `${env.serverUrl}/api/docs`,
    });
    serverLogger.info(LOG_MESSAGES.SERVER_ENVIRONMENT, {
      env: env.nodeEnv,
    });
  });

  const shutdown = async (signal: string): Promise<void> => {
    serverLogger.info(LOG_MESSAGES.SERVER_SHUTDOWN_SIGNAL, { signal });
    serverLogger.info(LOG_MESSAGES.SERVER_SHUTTING_DOWN);

    server.close(async () => {
      await disconnectDatabase();
      serverLogger.info(LOG_MESSAGES.SERVER_SHUTDOWN_COMPLETE);
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
  process.on('SIGINT', () => { void shutdown('SIGINT'); });
}

bootstrap().catch((err: Error) => {
  serverLogger.error(LOG_MESSAGES.SERVER_BOOT_FAILED, {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
