const {
  jwt: { cookieExpire },
} = require('../config');

const regexConstants = {
  // eslint-disable-next-line no-useless-escape
  email: '/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/',
};

const getExpirationTime = () => {
  const date = new Date();
  return date.setDate(date.getDate() + cookieExpire);
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

module.exports = { getExpirationTime, filterObj, regexConstants };
