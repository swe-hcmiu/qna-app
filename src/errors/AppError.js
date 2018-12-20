class AppError extends Error {
  constructor(httpCode, description, innerError) {
    super(innerError);
    this.httpCode = httpCode;
    this.description = description;
    if (!innerError) super.message = this.description;
  }
}

module.exports = {
  AppError,
};
