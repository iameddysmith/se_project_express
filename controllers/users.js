const mongoose = require("mongoose");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR)
        .json({ message: "Error retrieving users", error: err });
    });
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
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .json({ message: "Error retrieving user", error: err });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((newUser) => res.status(201).json(newUser))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST)
          .json({ message: "Invalid user data", error: err });
      } else {
        res
          .status(SERVER_ERROR)
          .json({ message: "Error creating user", error: err });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
