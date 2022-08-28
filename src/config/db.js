const { connect } = require('mongoose');

const {
  db: { mongoUri, useNewUrlParser, useUnifiedTopology },
} = require('.');

const database = {
  authenticate: () =>
    connect(mongoUri, {
      useNewUrlParser,
      useUnifiedTopology,
    }),
};

module.exports = { database };
