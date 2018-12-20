class AppError extends Error {
  constructor(message, httpCode, innerError) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = httpCode;
    this.innerError = innerError;
    Error.stackTraceLimit = 1;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  AppError,
};
