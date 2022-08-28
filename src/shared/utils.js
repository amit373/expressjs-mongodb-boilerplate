const NodeEnv = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

const isNull = (val) => val === null;

const isUndefined = (obj) => typeof obj === 'undefined';

const isNil = (val) => val === '';

const isEmpty = (val) => isUndefined(val) || isNull(val) || isNil(val);

const isBoolean = (obj) => typeof obj === 'boolean';

const getOsEnv = (key) => {
  const { env } = process;
  if (isEmpty(env[key])) {
    throw new Error(`[ENV] ${key} is not set.`.bgRed);
  }
  return env[key];
};

const getOsEnvOptional = (key) => process.env[key];

const toNumber = (val) => Number.parseInt(val, 10);

const toInteger = (val) => {
  if (Number.isNaN(Number.parseInt(val, 10))) {
    return 0;
  }
  return Number.parseInt(val, 10);
};

const toBool = (val) => {
  if (val === true || val === 'true') {
    return true;
  }
  if (val === false || val === 'false') {
    return false;
  }
  throw new Error('Parse failed (boolean string is expected)');
};

const isValidInt = (val) => toInteger(val) !== 0;

const normalizePort = (port) => {
  const parsedPort = toNumber(port);
  if (Number.isNaN(parsedPort)) {
    return port;
  }
  if (parsedPort >= 0) {
    return parsedPort;
  }
  return false;
};

const isObject = (fn) => !isEmpty(fn) && typeof fn === 'object';

const isFunction = (val) => typeof val === 'function';

const isString = (val) => typeof val === 'string';

const isNumber = (val) => typeof val === 'number';

const isConstructor = (val) => val === 'constructor';

module.exports = {
  NodeEnv,
  getOsEnv,
  getOsEnvOptional,
  isConstructor,
  isEmpty,
  isFunction,
  isNil,
  isNull,
  isNumber,
  isBoolean,
  isObject,
  isString,
  isUndefined,
  toInteger,
  isValidInt,
  toBool,
  toNumber,
  normalizePort,
};
