const { ValidationError } = require('objection');
const { AppError } = require('../errors/AppError');

function processErrorWithoutHttpCode(err) {
  let returnErr;
  if (err instanceof ValidationError) {
    returnErr = new AppError(err.message, 400, err);
  } else {
    returnErr = new AppError('Internal Server Error', 500, err);
  }
  return returnErr;
}

module.exports = async (err, req, res, next) => {
  console.log(err);
  if (!err.httpCode) {
    err = processErrorWithoutHttpCode(err);
  }

  res.status(err.httpCode).send({
    errors: {
      message: err.message,
      httpCode: err.httpCode,
    },
  });
};
