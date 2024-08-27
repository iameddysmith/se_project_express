const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const mongoose = require("mongoose");
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

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      return res.status(OK).json(user);
    })
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

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(CONFLICT).json({ message: "Email already in use" });
      }

      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          return User.create({ name, avatar, email, password: hashedPassword });
        })
        .then((newUser) => {
          const userResponse = newUser.toObject();
          delete userResponse.password;
          res.status(CREATED).json(userResponse);
        })
        .catch((err) => {
          console.error(err);
          if (err.name === "ValidationError") {
            return res
              .status(BAD_REQUEST)
              .json({ message: "Invalid user data" });
          }
          return res
            .status(SERVER_ERROR)
            .json({ message: "Error creating user" });
        });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .json({ message: "Error checking existing user" });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      return res.status(OK).json(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data provided" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "Error updating profile" });
    });
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
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
