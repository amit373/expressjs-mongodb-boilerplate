const {
  createLogger,
  format: { combine, timestamp, printf },
  transports: { Console, File },
} = require('winston');

const customFormat = combine(
  timestamp(),
  printf((info) => {
    const isAction = info.action ? ` [${info.action}]` : '';
    const statusCode = info.statusCode ? ` [${info.statusCode}]` : '';
    return `${info.timestamp} [${info.level
      .toUpperCase()
      .padEnd(7)
      .trim()}]${isAction}${statusCode} ${info.message}`;
  }),
);

const logger = createLogger({
  transports: [new Console(), new File({ filename: 'logs.log' })],
  format: customFormat,
  colorize: true,
});

module.exports = { logger };
