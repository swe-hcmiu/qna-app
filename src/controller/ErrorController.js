module.exports = async (err, req, res, next) => {
  res.status(err.httpCode).send({
    errors: {
      message: err.message,
      httpCode: err.httpCode,
    },
  });
};
