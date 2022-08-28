const { User } = require('../models');
const { HttpStatus } = require('../constants');
const { asyncHandler } = require('../middleware');
const {
  HttpException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} = require('../errors');
const { logger } = require('../shared');
const { bcryptService, jwtService } = require('../services');
const config = require('../config');

/**
  @desc   Signup user
  @param  { firstName, lastName, email, password }
  @method POST
  @route  /api/v1/auth/signup
  @access Public
*/
exports.signupHandler = asyncHandler(async (req, res, _) => {
  const { email, firstName, lastName, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new BadRequestException('Email is already taken');
  }

  // Create user
  await User.create({ firstName, lastName, email, password });

  logger.info(
    `${HttpStatus.CREATED} - ${req.originalUrl} [${req.method}] - 'Signup successfully!' `,
  );
  return res
    .status(HttpStatus.CREATED)
    .json({ statusCode: HttpStatus.CREATED, message: 'Signup Successfully!' });
});

/**
  @desc   Login user
  @param  { email, password }
  @method POST
  @route  /api/v1/auth/login
  @access Public
*/
exports.loginHandler = asyncHandler(async (req, res, _) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Check current password
  if (!(await user.matchPassword(password))) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Create token
  const token = jwtService.signToken(user._id);

  res.setHeader('token', token);
  res.cookie('token', token, jwtService.getCookieOptions(req));

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Login successfully!',
  });
});

/**
  @desc   Get current logged in user
  @param  GET
  @method POST
  @route  /api/v1/auth/me
  @access Private
*/
exports.getMeHandler = asyncHandler(async (req, res, _) => {
  // user is already available in req due to the protect middleware
  const { user } = req;

  // remove sensitive information
  user.createdAt = undefined;
  user.__v = undefined;

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'User details fetched successfully!',
    data: user,
  });
});

/**
  @desc   Forgot password
  @param  { email }
  @method POST
  @route  /api/v1/auth/forgotPassword
  @access Public
*/
exports.forgotPasswordHandler = asyncHandler(async (req, res, _) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException('There is no user with that email');
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  const resetUrl = `${config.clientUrl}resetPassword/${resetToken}`;

  await user.save({ validateBeforeSave: false });

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    message: 'Email sent',
    data: { resetToken, resetUrl },
  });
});

/**
  @desc   Reset password
  @param  resetToken
  @body   password
  @method PUT
  @route  /api/v1/auth/resetPassword/:resetToken
  @access Public
*/
exports.resetPasswordHandler = asyncHandler(async (req, res, _) => {
  const { resetToken } = req.params;

  if (!resetToken) {
    throw new HttpException(
      'resetToken is required',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  const { password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: bcryptService.updateResetToken(resetToken),
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestException('Invalid token');
  }
  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res
    .status(HttpStatus.OK)
    .json({ statusCode: HttpStatus.OK, message: 'Reset Successfully!' });
});

exports.logoutHandler = (_, res) => {
  res.cookie('token', 'loggedOut', {
    maxAge: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return res
    .status(HttpStatus.OK)
    .json({ statusCode: HttpStatus.OK, message: 'Logout Successfully!' });
};
