const mongoose = require("mongoose");
const User = require("../models/user");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).json(users))
    .catch(() =>
      res.status(SERVER_ERROR).json({ message: "Error retrieving users" })
    );
};

const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid user ID format" });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      return res.status(OK).json(user);
    })
    .catch(() =>
      res.status(SERVER_ERROR).json({ message: "Error retrieving user" })
    );
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((newUser) => res.status(CREATED).json(newUser))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).json({ message: "Invalid user data" });
      } else {
        res.status(SERVER_ERROR).json({ message: "Error creating user" });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
