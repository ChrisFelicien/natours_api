import ErrorConstructor from "../utils/Errors.js";

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong please try again later";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack
  });
};

export default globalError;
