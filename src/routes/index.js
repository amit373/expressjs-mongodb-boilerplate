const restRouter = require('express').Router();

const {
  Routes: { AUTH, USER },
} = require('../constants');
const { authRouter } = require('./auth.routes');
const { usersRouter } = require('./users.routes');

restRouter.use(AUTH.DEFAULT, authRouter);
restRouter.use(USER.DEFAULT, usersRouter);

module.exports = { restRouter };
