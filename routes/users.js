const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const usersController = require("../controllers/users")
const postsController = require("../controllers/posts");
const reelsController = require("../controllers/reels")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get('/editprofile', ensureAuth, usersController.editUserProfile)

module.exports = router

// router.get("/:userName", usersController.getProfile)