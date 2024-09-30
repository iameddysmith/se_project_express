const express = require("express");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUpdateUserProfile } = require("../middlewares/validation");

const router = express.Router();

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUserProfile, updateProfile);

module.exports = router;
