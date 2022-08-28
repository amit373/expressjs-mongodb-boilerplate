const { isDevelopment } = require('../config');
const { HttpStatus, HttpMessage, ErrorMessage } = require('../constants');
const { BadRequestException, UnauthorizedException } = require('../errors');
const { logger } = require('../shared');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err?.path}: ${err?.value}.`;
  return new BadRequestException(message);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err?.message?.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new BadRequestException(message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err?.errors)?.map((el) => el?.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new BadRequestException(message);
};

const logError = (err, req, res) => {
  const message =
    err?.message || res?.statusMessage || ErrorMessage.SOMETHING_WENT_WRONG;
  logger.error(
    `${err?.statusCode} - ${req.originalUrl} [${req.method}] - ${message} `,
  );
};

const handleJWTError = (err) => {
  const error = { ...err, message: ErrorMessage.INVALID_TOKEN };
  return new UnauthorizedException(error.message);
};

const handleJWTExpiredError = (err) => {
  const error = { ...err, message: ErrorMessage.TOKEN_EXPIRED };
  return new UnauthorizedException(error.message);
};

const sendError = (err, req, res) => {
  if (isDevelopment) {
    console.error('Error 💥', {
      statusCode: err.statusCode,
      method: req.method,
      path: req.path,
      timestamp: new Date(),
      message: err.message,
    });
  }
  logError(err, req, res);
  return res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
  });
};

module.exports = (err, req, res, _) => {
  let error = { ...err }; // Don't change to const
  error.statusCode =
    err?.statusCode || err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
  error.message = err?.message || HttpMessage.INTERNAL_SERVER_ERROR;
  if (error?.name === 'CastError') error = handleCastErrorDB(error);
  if (error?.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error?.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error?.name === 'JsonWebTokenError') error = handleJWTError();
  if (error?.name === 'TokenExpiredError') error = handleJWTExpiredError();
  sendError(error, req, res);
};
