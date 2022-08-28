const { HttpStatus, HttpMessage } = require('../constants');
const { HttpException } = require('./http.exception');

class NotFoundException extends HttpException {
  constructor(message) {
    super(message);
    this.message = message || HttpMessage.NOT_FOUND;
    this.statusCode = HttpStatus.NOT_FOUND;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { NotFoundException };
