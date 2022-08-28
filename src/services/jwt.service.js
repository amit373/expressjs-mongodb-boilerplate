const { sign, verify, decode } = require('jsonwebtoken');

const {
  isDevelopment,
  jwt: { jwtSecret, expiresIn, cookieExpire },
} = require('../config');

const verifyToken = async (token) => {
  const decoded = await verify(token, jwtSecret);
  return decoded;
};

const decodeToken = (token) => {
  const decodedToken = decode(token);
  return decodedToken;
};

const signToken = (id) => {
  const token = sign({ id }, jwtSecret, {
    expiresIn,
    issuer: 'NodeJS',
  });

  return token;
};

const getCookieOptions = (req) => {
  const options = {
    secure:
      !isDevelopment ||
      req?.secure ||
      req?.headers['x-forwarded-proto'] === 'https',
    httpOnly: true,
    maxAge: Date.now() + cookieExpire * 24 * 60 * 60 * 1000,
  };
  return options;
};

module.exports = {
  verifyToken,
  decodeToken,
  signToken,
  getCookieOptions,
};
