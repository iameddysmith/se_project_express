const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, SERVER_ERROR } = require("../utils/errors");
const mongoose = require("mongoose");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Error retrieving clothing items", error: err })
    );
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((newItem) => res.status(201).json(newItem))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({
          message: "Invalid clothing item data",
          error: err,
        });
      }
      res.status(SERVER_ERROR).json({
        message: "Error creating clothing item",
        error: err,
      });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndRemove(itemId)
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((err) =>
      res.status(500).send({ message: "Error deleting item", error: err })
    );
};

// Like handler
const likeItem = (req, res) => {
  const { itemId } = req.params;

  // Validate itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) =>
      res.status(500).send({ message: "Error liking item", error: err })
    );
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) =>
      res.status(500).send({ message: "Error disliking item", error: err })
    );
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
