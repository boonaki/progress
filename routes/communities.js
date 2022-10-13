const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const communitiesController = require("../controllers/communities")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

module.exports = router;