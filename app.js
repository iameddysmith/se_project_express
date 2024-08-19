const mongoose = require("mongoose");
const express = require("express");
const routes = require("./routes");
const { NOT_FOUND } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "66bca3ab81c82cb5eb0969ce",
  };
  next();
});

app.use(routes);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
