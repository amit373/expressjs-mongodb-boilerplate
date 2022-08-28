const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');

const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const compression = require('compression');
const xss = require('xss-clean');
const helmet = require('helmet');
const { join } = require('path');

require('colors');

const { logger, swaggerDocument } = require('./shared');
const { NotFoundException } = require('./errors');
const { errorHandler } = require('./middleware');
const { baseUrl, corsUrl } = require('./config');

// Routes
const { restRouter } = require('./routes');
const { ErrorMessage, HttpStatus, Routes } = require('./constants');

process.on('uncaughtException', (err) => {
  console.log(ErrorMessage.UNCAUGHT_EXCEPTION.red.underline.bold);
  logger.error(`UNCAUGHT EXCEPTION! ${err?.name}: ${err?.message}`, () =>
    process.exit(1),
  );
});

const app = express();

// Swagger route
app.use(
  '/api-docs',
  (req, _, next) => {
    swaggerDocument.host = req.get('host');
    swaggerDocument.basePath = baseUrl;
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(),
);

// Implement CORS
app.use(cors({ origin: corsUrl }));
app.options('*', cors({ origin: corsUrl }));

// Serving static files
app.use(express.static(join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Rate limiting requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: ErrorMessage.TO_MANY_REQUEST,
});
app.use(limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Compression
app.use(compression());

// Root Route
app.get(`${baseUrl}${Routes.HEALTH}`, (req, res) => {
  logger.info(
    `${HttpStatus.OK} - ${ErrorMessage.SERVER_HEALTH} - ${req.originalUrl} [${req.method}]`,
  );
  return res
    .status(HttpStatus.OK)
    .json({ statusCode: HttpStatus.OK, message: ErrorMessage.SERVER_HEALTH });
});

// Mount routes
app.use(`${baseUrl}`, restRouter);

// Error Routes
app.all('*', (req, _, __) => {
  throw new NotFoundException(`Can't find ${req?.originalUrl} on this server!`);
});
app.use(errorHandler);

process.on('unhandledRejection', (err) => {
  console.log(ErrorMessage.UNCAUGHT_REJECTION.red.underline.bold);
  logger.error(`UNCAUGHT REJECTION! ${err?.name}: ${err?.message}`, () =>
    process.exit(1),
  );
});

module.exports = { app };
