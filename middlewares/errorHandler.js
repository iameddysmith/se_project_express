const { SERVER_ERROR } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  const statusCode = err.statusCode || SERVER_ERROR;
  const message =
    statusCode === SERVER_ERROR ? "Internal Server Error" : err.message;

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
