const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const devController = require("../controllers/dev");
const postsController = require("../controllers/posts");
const reelsController = require("../controllers/reels");
const usersController = require("../controllers/users")
const { ensureAuth, ensureGuest } = require("../middleware/auth");


router.put('/dothething', devController.doTheThing)

module.exports = router;