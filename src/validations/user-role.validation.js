const Joi = require('joi');

const { UserRoles, HttpStatus } = require('../constants');
const { HttpException, JoiException } = require('../errors');

exports.validateCreateUserRole = async (req, _, next) => {
  const schema = Joi.object().keys({
    role: Joi.string().valid(UserRoles.USER, UserRoles.ADMIN).required(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
