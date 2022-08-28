const { ErrorMessage } = require('../constants');
const { ForbiddenException } = require('../errors');

const restrictTo =
  (...roles) =>
  (req, _, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      throw new ForbiddenException(ErrorMessage.PERMISSION_DENIED);
    }
    return next();
  };

module.exports = { restrictTo };
