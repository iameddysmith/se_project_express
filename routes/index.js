const express = require("express");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const NotFoundError = require("../utils/errors/NotFoundError");
const {
  validateUserLogin,
  validateCreateUser,
} = require("../middlewares/validation");

const router = express.Router();

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use(() => {
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
