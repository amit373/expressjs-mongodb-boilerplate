const { app } = require('./src/app');
const { database } = require('./src/config/db');
const { logger } = require('./src/shared');
const { port, env } = require('./src/config');

async function bootstrap() {
  try {
    await database.authenticate().then(() => {
      logger.info({
        action: 'Database',
        message: `Database connected 🔥 on ${env} mode...`,
      });

      app.listen(port, () => {
        logger.info({
          action: 'Bootstrap',
          message: `Server running 🚀 on port:${port} in ${env} mode...`,
        });
      });
    });
  } catch (error) {
    logger.error({
      action: 'Database',
      message: `Database not connected: ${error?.message}`,
    });
    process.exit(1);
  }
}

bootstrap();
