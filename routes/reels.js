const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/reels");
const { ensureAuth, ensureGuest } = require("../middleware/auth");