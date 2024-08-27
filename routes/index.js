const express = require("express");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

module.exports = router;
