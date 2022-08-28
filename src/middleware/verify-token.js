const asyncHandler = require('./async-handler');
const { User } = require('../models');
const { jwtService } = require('../services');
const { ErrorMessage } = require('../constants');
const { UnauthorizedException } = require('../errors');

// @desc   Verify Token Middleware
const verifyToken = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new UnauthorizedException(ErrorMessage.NOT_LOGGED_IN));
  }

  // 2) Verification token
  const decoded = await jwtService.verifyToken(token);
  if (!decoded || !decoded.id) {
    return next(
      new UnauthorizedException(ErrorMessage.USER_WITH_TOKEN_NOT_EXIST),
    );
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded?.id);
  if (!currentUser) {
    return next(
      new UnauthorizedException(ErrorMessage.USER_WITH_TOKEN_NOT_EXIST),
    );
  }

  // Check if user changed password after the token was issued
  if (currentUser?.changedPasswordAfter(decoded?.iat)) {
    return next(
      new UnauthorizedException(ErrorMessage.RECENTLY_CHANGED_PASSWORD),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  return next();
});

module.exports = {
  verifyToken,
};
