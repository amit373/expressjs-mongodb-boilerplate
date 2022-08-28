const { genSalt, compare, hash } = require('bcryptjs');
const { createHash, randomBytes } = require('crypto');

const config = require('../config');

const hashPassword = async (password) => {
  const salt = await genSalt(config.hash);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (enteredPassword, originalPassword) => {
  const isMatch = await compare(enteredPassword, originalPassword);
  return isMatch;
};

const getResetPasswordToken = (minutes = 10) => {
  // Generate token
  const resetToken = randomBytes(config.cryptoRounds).toString('hex');

  // Hash token and set to resetPasswordToken field
  const resetPasswordToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire 10 mins
  const resetPasswordExpire = new Date(Date.now() + minutes * 60 * 1000);
  return {
    resetToken,
    resetPasswordToken,
    resetPasswordExpire,
  };
};

const updateResetToken = (resetToken) => {
  const resetPasswordToken = createHash('sha256')
    .update(resetToken)
    .digest('hex');
  return resetPasswordToken;
};

module.exports = {
  hashPassword,
  comparePassword,
  updateResetToken,
  getResetPasswordToken,
};
