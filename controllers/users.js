const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  OK,
  CREATED,
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ServerError,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.status(OK).json(user);
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password || !name || !avatar) {
    return next(
      new BadRequestError(
        "All fields are required: email, password, name, avatar"
      )
    );
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("Email already in use");
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((newUser) => {
      const userResponse = newUser.toObject();
      delete userResponse.password;
      res.status(CREATED).json(userResponse);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError("User not found");
      }
      res.status(OK).json(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(OK).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
