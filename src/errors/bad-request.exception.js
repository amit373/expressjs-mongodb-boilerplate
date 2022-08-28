const { HttpStatus, HttpMessage } = require('../constants');
const { HttpException } = require('./http.exception');

class BadRequestException extends HttpException {
  constructor(message) {
    super(message);
    this.message = message || HttpMessage.BAD_REQUEST;
    this.statusCode = HttpStatus.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { BadRequestException };
