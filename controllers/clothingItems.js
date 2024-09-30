const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const { CREATED } = require("../utils/errors");

// Get all clothing items
const getClothingItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => next(err));

// Create a new clothing item
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((newItem) => res.status(CREATED).json(newItem))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid clothing item data"));
      }
      return next(err);
    });
};

// Delete a clothing item
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }

      return item
        .remove()
        .then(() => res.send({ message: "Item deleted successfully" }));
    })
    .catch((err) => next(err));
};

// Like a clothing item
const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch((err) => next(err));
};

// Dislike a clothing item
const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch((err) => next(err));
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
