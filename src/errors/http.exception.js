const { HttpStatus, HttpMessage } = require('../constants');

class HttpException extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message || HttpMessage.INTERNAL_SERVER_ERROR;
    this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { HttpException };
