const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const winston = require("winston");
require("dotenv").config();
const { errors } = require("celebrate");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const apiLimiter = require("./middlewares/rateLimiter");

const app = express();
const { PORT = 3001 } = process.env;

app.use(helmet());
app.use(apiLimiter);

// remove after review
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => winston.info("Connected to MongoDB"))
  .catch((err) => winston.error("Failed to connect to MongoDB", err));

app.listen(PORT, () => {
  winston.info(`Server is running on port ${PORT}`);
});
