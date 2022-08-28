const { HttpStatus, HttpMessage } = require('../constants');
const { HttpException } = require('./http.exception');

class ForbiddenException extends HttpException {
  constructor(message) {
    super(message);
    this.message = message || HttpMessage.FORBIDDEN;
    this.statusCode = HttpStatus.FORBIDDEN;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { ForbiddenException };
