const swaggerDocument = require('./swagger.json');

module.exports = {
  swaggerDocument,
  ...require('./logger'),
  ...require('./utils'),
  ...require('./helpers'),
};
