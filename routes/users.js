const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const usersController = require("../controllers/users")
const upload = require("../middleware/multer");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get('/:userName', usersController.getUserProfile)

router.get('/:userName/editprofile', ensureAuth, usersController.editUserProfile)

router.get('/:userName/followers', usersController.getFollowersPage)

router.put('/:userName/editprofile/submit', upload.single("file"), usersController.submitProfileEdit)

router.put('/:userName/:userId/:reqUserId/follow', usersController.followUser)

module.exports = router

// router.get("/:userName", usersController.getProfile)