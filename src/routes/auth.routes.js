const authRouter = require('express').Router();

const {
  Routes: { AUTH },
} = require('../constants');
const {
  authController: {
    signupHandler,
    loginHandler,
    getMeHandler,
    logoutHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
  },
} = require('../controller');
const { verifyToken } = require('../middleware');
const {
  auth: {
    validateLogin,
    validateSignup,
    validateForgotPassword,
    validateResetPassword,
  },
} = require('../validations');

authRouter.post(AUTH.SIGNUP, validateSignup, signupHandler);
authRouter.post(AUTH.LOGIN, validateLogin, loginHandler);
authRouter.get(AUTH.ME, verifyToken, getMeHandler);
authRouter.post(
  AUTH.FORGOT_PASSWORD,
  validateForgotPassword,
  forgotPasswordHandler,
);
authRouter.put(
  AUTH.RESET_PASSWORD,
  validateResetPassword,
  resetPasswordHandler,
);
authRouter.get(AUTH.LOGOUT, logoutHandler);

module.exports = { authRouter };
