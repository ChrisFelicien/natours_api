class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "Fail" : "Error";
    this.isOperational = true;
    this.stack = Error.captureStackTrace(this.constructor, this);
  }
}

export default ErrorHandler;
