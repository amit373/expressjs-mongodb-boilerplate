const { BadRequestException } = require('./bad-request.exception');
const { HttpException } = require('./http.exception');
const { ConflictException } = require('./conflict.exception');
const { ForbiddenException } = require('./forbidden.exception');
const { NotFoundException } = require('./not-found.exception');
const { UnauthorizedException } = require('./unauthorized.exception');
const { JoiException } = require('./joi.exception');

module.exports = {
  HttpException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  JoiException,
};
