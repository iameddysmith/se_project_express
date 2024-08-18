const express = require("express");
const router = express.Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

module.exports = router;
