const dotenv = require('dotenv');

const {
  NodeEnv,
  toNumber,
  getOsEnv,
  normalizePort,
} = require('../shared/utils');

dotenv.config({ path: `.env.${getOsEnv('NODE_ENV')}` });

module.exports = {
  env: getOsEnv('NODE_ENV'),
  port: normalizePort(getOsEnv('PORT')),
  isProduction: getOsEnv('NODE_ENV') === NodeEnv.PRODUCTION,
  isDevelopment: getOsEnv('NODE_ENV') === NodeEnv.DEVELOPMENT,
  baseUrl: '/api/v1',
  db: {
    mongoUri: getOsEnv('MONGO_URL'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  jwt: {
    expiresIn: getOsEnv('EXPIRES_IN'),
    jwtSecret: getOsEnv('JWT_SECRET'),
    cookieExpire: toNumber(getOsEnv('COOKIE_EXPIRE')),
  },
  hash: toNumber(getOsEnv('HASH_SALT')),
  cryptoRounds: toNumber(getOsEnv('CRYPTO_ROUNDS')),
  corsUrl: '*',
  clientUrl: getOsEnv('CLIENT_URL'),
};
