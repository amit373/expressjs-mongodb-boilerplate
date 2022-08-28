const Joi = require('joi');
const { HttpStatus } = require('../constants');

const { HttpException, JoiException } = require('../errors');

exports.validateSignup = async (req, _, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().max(15).required(),
    lastName: Joi.string().max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateLogin = async (req, _, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(30),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateForgotPassword = async (req, _, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};

exports.validateResetPassword = async (req, _, next) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(8).max(30),
  });

  const { error } = await JoiException(schema, req.body);
  if (error) {
    return next(new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY));
  }
  return next();
};
