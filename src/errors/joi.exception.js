const { ErrorMessage } = require('../constants');

const JoiException = async (schema, body) => {
  try {
    return { error: null, value: await schema?.validateAsync(body) };
  } catch (err) {
    const error = err?.details[0]?.message || ErrorMessage.SOMETHING_WENT_WRONG;
    return { value: null, error };
  }
};

module.exports = { JoiException };
