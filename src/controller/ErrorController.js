function getResponseError(err) {
  const error = err;
  switch (error.message) {
    case 'Invalid input': {
      error.httpCode = 422;
      break;
    }
    case 'Authorization required': {
      error.httpCode = 401;
      break;
    }
    case 'Not Found': {
      error.httpCode = 404;
      break;
    }
    default: {
      error.httpCode = 500;
      error.description = 'Internal Server Error';
      break;
    }
  }
  return error;
}

module.exports = async (err, req, res, next) => {
  console.log(err);
  let errTmp = err;
  if (!errTmp.httpCode) errTmp = getResponseError(errTmp);

  const errors = {
    description: errTmp.description,
  };
  res.status(errTmp.httpCode).send({ errors });
};
