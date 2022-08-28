const { HttpStatus, HttpMessage } = require('../constants');
const { HttpException } = require('./http.exception');

class UnauthorizedException extends HttpException {
  constructor(message) {
    super(message);
    this.message = message || HttpMessage.UNAUTHORIZED;
    this.statusCode = HttpStatus.UNAUTHORIZED;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { UnauthorizedException };
