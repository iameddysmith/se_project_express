const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) =>
      user
        ? res.status(OK).json(user)
        : res.status(NOT_FOUND).json({ message: "User not found" })
    )
    .catch(() =>
      res.status(SERVER_ERROR).json({ message: "Error retrieving user data" })
    );
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password || !name || !avatar) {
    return res.status(BAD_REQUEST).json({
      message: "All fields are required: email, password, name, avatar",
    });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(CONFLICT).json({ message: "Email already in use" });
      }

      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
          User.create({ name, avatar, email, password: hashedPassword })
        )
        .then((newUser) => {
          const userResponse = newUser.toObject();
          delete userResponse.password;
          res.status(CREATED).json(userResponse);
        })
        .catch((err) => {
          console.error(err);
          return err.name === "ValidationError"
            ? res.status(BAD_REQUEST).json({ message: "Invalid user data" })
            : res.status(SERVER_ERROR).json({ message: "Error creating user" });
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR)
        .json({ message: "Error checking existing user" });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) =>
      updatedUser
        ? res.status(OK).json(updatedUser)
        : res.status(NOT_FOUND).json({ message: "User not found" })
    )
    .catch((err) =>
      err.name === "ValidationError"
        ? res.status(BAD_REQUEST).json({ message: "Invalid data provided" })
        : res.status(SERVER_ERROR).json({ message: "Error updating profile" })
    );
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
