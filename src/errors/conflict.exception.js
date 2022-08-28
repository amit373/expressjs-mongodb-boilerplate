const { HttpStatus, HttpMessage } = require('../constants');
const { HttpException } = require('./http.exception');

class ConflictException extends HttpException {
  constructor(message) {
    super(message);
    this.message = message || HttpMessage.CONFLICT;
    this.statusCode = HttpStatus.CONFLICT;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { ConflictException };
